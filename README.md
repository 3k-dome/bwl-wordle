# bwl-wordle
Wordle but with business related terms. University project 2022.

## game concept
1. not a typical clone but game logic remains the same
2. expanded by addtional settings which change difficulty
3. random word length between x and y letters chosen each day
4. daily and global scoreboard
    1. fair and dynamic scoring symstem
    2. score weigthed by chosen difficulty (available tries) and needed tries
    3. score weigthed by used time
    4. scoreboard sorted by scores (sorted by time of day on draw )


## technical concept
* Web application
    * responsive design &rarr; mobile support & easy accessibility

### Backend
1. developed in Python (Flask & SQLite)
2. provides word of the day and evaluates user input against dictionaries
3. management of scoreboard and user accounts

### Frontend
1. developed in JavaScript/ ReactJS
2. captures user input and transfers it to backend
3. displays game and communication with client


## install

### backend

in project root (backend, frontend, readme, ...) open cmd.
```
python -m venv venv
./venv/Scripts/Activate.ps1
python -m pip install -r requirements.txt
```
