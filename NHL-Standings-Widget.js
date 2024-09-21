

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
        }

         let _HeadingText;
         HeadingText = oHeadingStack.addText(
           ' ${_StnadingData.divisionSequence}   ${_StnadingData.teamAbbrev}    ${_StnadingData.gamesPlayed}   ${_StnadingData.wins}   ${_StnadingData.losses}'
         );
    
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
        
        const _Standings = fetchCurrentStandings;

        if(_Standings && _Standings?.standings){
            const _TeamStandings = _Standings.standings.find(standing=> standing.teamAbbrev.default === "TOR");
        }
        if(!!_TeamStandings) {
            _TeamData.leagueSequence = _TeamStandings.leagueSequence;
            _TeamData.conferenceSequence = _TeamStandings.conferenceSequence;
            _TeamData.divisionSequence = _TeamStandings.divisionSequence;
            _TeamData.teamAbbrev = _TeamStandings.teamAbbrev;
            _TeamData.gamesPlayed = _TeamStandings.gamesPlayed;
            _TeamData.wins = _TeamStandings.wins;
            _TeamData.losses = _TeamStandings.losses;
        }

        return _TeamData;

     }

     async function fetchCurrentStandings()
     {
        const _URL = "https://api-web.nhle.com/v1/standings/now";
        const _Request = new Request(_URL);
        const _Data = await _Request.loadJSON();

        return _Data;
     }
     