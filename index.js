#!/usr/bin/env node

const childProcess = require('child_process')
const os = require('os')
const yargs = require('yargs')
const _ = require('highland')
const R = require('ramda')
const chalk = require('chalk')

const argv = yargs
    .option('l', {
        alias: 'labels',
        type: 'array',
        default: []
    })
    .argv

const colors = [
    'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'
]

function runCommand(name, args, prefix, color) {
    const coloredPrefix = chalk[color](`[${prefix}]`)
    const cmd = childProcess.spawn(name, args)

    _(cmd.stdout)
        .map(R.curry(prefixBuferLines)(coloredPrefix))
        .pipe(process.stdout)

    _(cmd.stderr)
        .map(R.curry(prefixBuferLines)(coloredPrefix))
        .pipe(process.stderr)
}

function prefixBuferLines(prefix, buffer) {
    const lines = buffer.toString()
    return prefixLines(prefix, lines)
}

function prefixLines(prefix, lines) {
    return lines.split(os.EOL)
        .filter(line => line.trim())
        .map(R.curry(prefixLine)(prefix))
        .join(os.EOL)
        .concat([os.EOL])
}

function prefixLine(prefix, line) {
    return prefix + ': ' + line
}

argv._.forEach((command, i) => {
    const parsedCommand = command.split(/\s+/)
    const commandName = parsedCommand[0]
    const commandArgs = parsedCommand.slice(1)
    runCommand(commandName, commandArgs, (argv.labels[i] || i), colors[i % colors.length])
})
