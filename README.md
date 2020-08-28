# merge-logs

Merge multiple sources and pipe them on stdout labeled

## Installation

```sh
npm i -g merge-logs
```

## Usage

```sh
merge-logs -l foo -l bar -- 'docker logs -f container1' 'docker logs -f container2'
```
