# Getting Started with Phaser 2

## Build a local web server

- use protocol to access the files
- server level security `http`
  - only access files you're meant to
- local file system `file://`
  - no concept of domains, no server level security, just a raw file system
  - js has the ability to load files from anywhere on your local file system, and send to other place
  - every single page becomes treated as a unique local domain
  - http://blog.chromium.org/2008/12/security-in-depth-local-web-pages.html

### windows

- python
  - reference: https://www.linuxjournal.com/content/tech-tip-really-simple-http-server-python
  - Open up a terminal and type:
      ```batch
      cd somedir
      python -m SimpleHTTPServer
      ```
  - Get a message:
      ```batch
      Serving HTTP on 0.0.0.0 port 8000 ...
      ```
  - Open a browser and type the following address:
      ```batch
      http://127.0.0.1:8000
      ```
