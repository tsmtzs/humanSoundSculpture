# *Human Sound Sculpture*
*To Kyriakos Kolesis*

## Overview
    Νύχτα.

    Άνθρωποι με ανέκφραστα πρόσωπα.
    Κατευθύνονται προς το ίδιο σημείο.
    
    Ο ένας πίσω από τον άλλο.
    Ούτε πολύ κοντά, ούτε μακριά.

    Σταματημένος ο Χρόνος.
*Human Sound Sculpture* is a piece for performers and algorithmic sound. It should be played outdoors in places like city parks, town squares, etc. This place must be quiet enough so that the overall amplitude of the piece stays in relative low levels and the frozen atmosphere is not destroyed. The ambient soundscape should be regarded as part of the piece.

The performance simply starts and lasts as long as the performers have decided. Similarly, the performance simply stops and the performers are leaving silently taking distinct paths.

## Technicalities
Each performer of *Human Sound Sculpture* carries a smart phone. This device is used as a loudspeaker and should be as less visible as possible. The device is connected to a local network and, using the browser, each performer opens one of the two web pages of the piece. She stays connected to the same web page until performance ends. The step of connecting to the network and loading the web page must be done before performance starts and is not part of the piece.

The two web pages that a performer can connect are tagged as *player* and *conductor*. The first is the default one that one can see when connects to the local web server. For the second, the performer must add the word *conductor* to the address. Each performance has at most one *conductor*.

The *conductor* page has a button that is used to start and end the performance. Specifically, by pressing the button, the *conductor* starts and stops the generation of sound events. If there is no *conductor* this task is handled by a person who is not part of the performance. She can start/kill the web server or start/stop a SuperCollider *EventStreamPlayer*.

### Web Server
The web server is written in [node.js](https://nodejs.org/en/). It receives OSC messages from SuperCollider and distributes them to web clients using web sockets. Each OSC message has one of the forms:
- [ /action, "*start*" / "*stop*" ]
- [ /note, *freq*, *amp*, *dur* ]

We have used the libraries [osc.js](https://github.com/colinbdclark/osc.js/) for OSC and [ws](https://github.com/websockets/ws) for web sockets.

### Web Clients
When a client receives a [ /note, *freq*, *amp*, *dur* ], message, it plays a synth with *freq*, *amp* and *dur* as arguments.

### SuperCollider
[SuperCollider](http://supercollider.github.io/) generates the sound events. A random walk on the vertices of a Paley graph of order 13 is used to select the *note*, *amp* and *dur* for a sound *Event*, as well as the *delta* time between succesive *Events*.
