

const CURRENT_SEASON = 20242025;

const WIDGET_URL = "nhl://"

//for Cahcing images on 32 Teams, saves data.
const ISCACHE = true;


/*
Type the abbervation of the division you want to track
Atlantic Division = A
Metropolitan Division = M
Central Division = C
Pacific Division = P
Wild Card = W
*/
const DIVISION = "A";

const DIVISION_SIZE = 8;


let _NhlWidget;
if(config.runsInWidget)
     {
        if(config.widgetFamily === "small")
        {
            _NhlWidget = await createSmallWidget();
        }
        if(config.widgetFamily === "meduim")
        {
            _NhlWidget = await createMediumWidget();
        }
        if(config.widgetFamily === "large")
        {
            _NhlWidget = await createLargeWidget();
        }
         Script.setWidget(_NhlWidget);
     } else
     {
        _NhlWidget = await createLargeWidget();
        _NhlWidget.presentLarge();
     }

     async function createSmallWidget()
     {
        const _Widget = new ListWidget();
        //Add Light mode later
        _Widget.backgroundColor = new Color("1D1D1D");
        _Widget.setPadding(10,10,10,10);
        if(WIDGET_URL.length > 0)
        {
            _Widget.url = WIDGET_URL;
        }

        await addSmallWidgetData(_Widget);

        return _Widget
     }

     async function createMediumWidget()
     {

     }
     async function createLargeWidget()
     {
        const _Widget = new ListWidget();
        _Widget.backgroundColor = new Color("1D1D1D");
        _Widget.setPadding(10,10,10,10);

        if(WIDGET_URL.length > 0){
            _Widget.url = WIDGET_URL;
        }

        await addLargeWidgetData(_Widget);

        return _Widget;
     }

     async function addSmallWidgetData(_Widget)
     {

     }

     async function addLargeWidgetData(_Widget)
     {
        const _StandingData = await prepareData();

        const _TopRow = _Widget.addStack();
        _TopRow.cornerRadius = 12;
        _TopRow.size = new Size(308, 100);
        _TopRow.setPadding(7,7,7,7);
        _TopRow.layoutVertically();

        if(_StandingData != null)
        {
            const _HeadingStack = _TopRow.addStack();
            _HeadingStack.layoutHorizontally();
            _HeadingStack.setPadding(2,2,2,2);

            let _HeadingText;
            _HeadingText = _HeadingStack.addText(
              `${_StandingData.divisionSequence}`
            );
            _HeadingText.font = Font.boldSystemFont(11);
            _HeadingText.textColor = new Color("FFFFFF");
          _HeadingStack.addSpacer(10);
            const imgRequest = new Request("https://www.thesportsdb.com/images/media/team/badge/1d465t1719573796.png/tiny");
            const img = await imgRequest.loadImage();

            const teamLogo = _HeadingStack.addImage(img);
            teamLogo.imageSize = new Size(30,30); 
            _HeadingStack.addSpacer(10);
            const secondaryText = _HeadingStack.addText(
     ` ${_StandingData.teamAbbrev}    ${_StandingData.gamesPlayed}   ${_StandingData.wins}   ${_StandingData.losses}  `
     );

          
          _HeadingText.leftAlignText();
       
        }

        
        /*for(let i = 0; i < DIVISION_SIZE; i++)
        {
            const _TeamData = prepareData(i);
        }*/

        

     }

     async function prepareData(currentStanding){

        /*Things I need to display on the widget:
        
        List the teams in order of placement in division.
        each team should start with Team Logo and then Team Abr i.e. TOR, OTT, VAN
        Team Games Played, Wins, Losses, OTL's, Points and Point%

        Example:
        1. (Logo) FLA 82 52 24 6 110 .671
        */ 
       
       const _TeamData = {
           leagueSequence: "",
           conferenceSequence: "",
           divisionSequence: "",
           teamLogo: "",
           teamAbbrev: "",
           gamesPlayed: "",
           wins: "",
           losses: "",
           otLosses: "",
           points: "", 
           pointPctg: ""
        }
        
        const _Standings =  await fetchCurrentStandings();

        const _StandingsTeam = await filterStandings(_Standings);

        if(!!_StandingsTeam) {
            _TeamData.leagueSequence = _StandingsTeam.leagueSequence;
            _TeamData.conferenceSequence = _StandingsTeam.conferenceSequence;
            _TeamData.divisionSequence = _StandingsTeam.divisionSequence;
            _TeamData.teamLogo = _StandingsTeam.teamLogo;
            _TeamData.teamAbbrev = _StandingsTeam.teamAbbrev;
            _TeamData.gamesPlayed = _StandingsTeam.gamesPlayed;
            _TeamData.wins = _StandingsTeam.wins;
            _TeamData.losses = _StandingsTeam.losses;
        }

        return _TeamData;

     }


     function filterStandings(_Standings)
     {
        let _Result = null;
        if(_Standings && _Standings?.standings){
            const _TeamStandings = _Standings.standings.find(standing => standing.teamAbbrev.default === "NYR");
            if(!!_TeamStandings)
            {
                _Result = {
                    leagueSequence: _TeamStandings.leagueSequence,
                    divisionSequence: _TeamStandings.divisionSequence,
                    teamLogo: _TeamStandings.teamLogo,
                    gamesPlayed: _TeamStandings.gamesPlayed,
                    teamAbbrev: _TeamStandings.teamAbbrev.default,
                    wins: _TeamStandings.wins,
                    losses: _TeamStandings.losses
                };
            }
        }

        return _Result;
     }


     async function loadLogo(teamAbbrev, logoURL)
     {
        let _Result;
        if(ISCACHE){
            const _Files = FileManager.local();

            const _CachePath = _Files.joinPath(_Files.cacheDirectory, teamAbbrev + "_NHL");
            const bCacheExists = _Files.FileManager(_CachePath);
        try{
            if(bCacheExists){
                _Result = _Files.readImage(_CachePath);
            }
            else
            {
                const _Request = new Request(logoURL);
                _Result = await _Request.loadImage();
                try{
                    _Files.writeImage(_CachePath, _Result);
                    console.log("Created cache entry for logo of " + teamAbbrev);
                }
                catch(e)
                {
                    console.log(e);
                }
            }
        }
        catch(_Error)
        {
            console.error(_Error);
            if(bCacheExists){
                _Result = _Files.readImage(_CachePath);
            }
            else{
                console.log("Fetching logo for "  + teamAbbrev + " failed");
            }
        }
    }
    else {
        const _Request = new Request(logoURL);
        _Result = await _Request.loadImage();
    }
    return _Result;
     }

     async function fetchCurrentStandings()
     {
        const _URL = "https://api-web.nhle.com/v1/standings/now";
        const _Request = new Request(_URL);
        const _Data = await _Request.loadJSON();

        return _Data;
     }

     function getTeamData()
    {

     }
     