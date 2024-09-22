

const CURRENT_SEASON = 20242025;

const WIDGET_URL = "nhl://"


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
        _TopRow.size = new Size(308, 15);
        _TopRow.setPadding(7,7,7,7);
        _TopRow.layoutVertically();

        if(_StandingData != null)
        {
            const _HeadingStack = _TopRow.AddStack();
            _HeadingStack.layoutHorizontally();
            _HeadingStack.AddSpacer();
            _HeadingStack.setPadding(7,7,7,7);

            let _HeadingText;
            _HeadingText = _HeadingStack.addText(
              `${_StandingData.divisionSequence}   ${_StandingData.teamAbbrev}    ${_StnandingData.gamesPlayed}   ${_StandingData.wins}   ${_StandingData.losses}`
            );
   
            _HeadingText.font = Font.boldSystemFont(11);
            _HeadingText.textColor = new Color("#FFFFF");
   
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
        
        const _Standings = fetchCurrentStandings();

        const _StandingsTeam = await filterStandings(_Standings);

        if(!!_StandingsTeam) {
            _TeamData.leagueSequence = _StandingsTeam.leagueSequence;
            _TeamData.conferenceSequence = _StandingsTeam.conferenceSequence;
            _TeamData.divisionSequence = _StandingsTeam.divisionSequence;
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
                    gamesPlayed: _TeamStandings.gamesPlayed,
                    teamAbbrev: _TeamStandings.teamAbbrev,
                    wins: _TeamStandings.wins,
                    losses: _TeamStandings.losses
                };
            }
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
     