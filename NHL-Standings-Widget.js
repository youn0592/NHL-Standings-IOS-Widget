

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
          
          const _ToppestRow = _Widget.addStack();
          _ToppestRow.size = new Size(400, 59);
          _ToppestRow.layoutVertically();
          
     let TopText = _ToppestRow.addText("Standings");
     TopText.leftAlignText();
     TopText.font = Font.boldSystemFont(25);
     _ToppestRow.addSpacer(1);
     let standingName = await GetStandingsName();
     let SubText = _ToppestRow.addText(`${standingName} Division`);
     SubText.leftAlignText()

        const _TopRow = _Widget.addStack();
        _TopRow.cornerRadius = 12;
        _TopRow.size = new Size(308, 250);
     _TopRow.backgroundColor = new Color("272727")
        _TopRow.setPadding(2,2,2,2);
        _TopRow.layoutVertically();

            const _HeadingStack = _TopRow.addStack();
            _HeadingStack.layoutHorizontally();
            _HeadingStack.setPadding(2,2,2,2);

            const _Standings =  await fetchCurrentStandings();
            const _DivisionStandings = await sortCurrentStandings(_Standings)

            let _StandingHeader = _TopRow.addStack();
            _StandingHeader.layoutHorizontally();
            _StandingHeader.setPadding(2,2,2,2);
            let _HeaderText = _StandingHeader.addText("RK  Logo  Team  GP  W   L  OTL  PT  P%")

            _StandingWidget = [];
            _StandingText = [];
            
            //This works!
            for(let i = 0; i < DIVISION_SIZE; ++i)
            {
                _StandingWidget[i] = _TopRow.addStack();
                _StandingWidget[i].layoutHorizontally();
                _StandingWidget[i].setPadding(2,2,2,2);
                _StandingText[i] = _StandingWidget[i].addText(`${_DivisionStandings[i].divisionSequence}`);
                _StandingText[i].textColor = new Color("FFFFFF");

                _StandingWidget[i].addSpacer(10);
                //Temp Code to replace with Caching
                const _LogoData = getTeamData();
                const _LogoURL = _LogoData[_DivisionStandings[i].teamAbbrev.default].logo;
                const imgReq = new Request(_LogoURL);
                const img = await imgReq.loadImage();

                const teamLogo = _StandingWidget[i].addImage(img);
                teamLogo.imageSize = new Size(25, 25);
                _StandingWidget[i].addSpacer(10);

                _StandingText[i] = _StandingWidget[i].addText(`${_DivisionStandings[i].teamAbbrev.default} ${_DivisionStandings[i].gamesPlayed} ${_DivisionStandings[i].wins} ${_DivisionStandings[i].losses} ${_DivisionStandings[i].otLosses} ${_DivisionStandings[i].points} ${_DivisionStandings[i].pointPctg}`);
                _TopRow.addSpacer(1);
             /*let _HeadingText;
            _HeadingText = _HeadingStack.addText(
              `${_StandingData.divisionSequence}`
            );
            _HeadingText.textColor = new Color("FFFFFF");
          _HeadingStack.addSpacer(10);
          const _LogoData = getTeamData();
          const _LogoURL = _LogoData[_StandingData.teamAbbrev].logo;
            const imgRequest = new Request(_LogoURL)
            const img = await imgRequest.loadImage();

            const teamLogo = _HeadingStack.addImage(img);
            teamLogo.imageSize = new Size(25,25); 
            _HeadingStack.addSpacer(10);
          console.log(_StandingData);
            const secondaryText = _HeadingStack.addText(
     ` ${_StandingData.teamAbbrev} ${_StandingData.gamesPlayed} ${_StandingData.wins} ${_StandingData.losses} ${_StandingData.otLosses} ${_StandingData.points}`
     );
          _HeadingText.leftAlignText();
          _TopRow.addSpacer(0);
          const _SecondRow = _TopRow.addStack();
       _SecondRow.layoutHorizontally();
     _SecondRow.setPadding(2,2,2,2);
     
     const text = _SecondRow.addText(');6-6/):?'); 
     */
        }
     
     
        
        /*for(let i = 0; i < DIVISION_SIZE; i++)
        {
            const _TeamData = prepareData(i);
        }*/

        

     }

     function filterStandings(_Standings)
     {
        let _Result = null;
        if(_Standings && _Standings?.standings){
            const _TeamStandings = _Standings.standings.find(standing => standing.teamAbbrev.default === "ANA");
            if(!!_TeamStandings)
            {
                _Result = {
                    leagueSequence: _TeamStandings.leagueSequence,
                    divisionSequence: _TeamStandings.divisionSequence,
                    gamesPlayed: _TeamStandings.gamesPlayed,
                    teamAbbrev: _TeamStandings.teamAbbrev.default,
                    wins: _TeamStandings.wins,
                    losses: _TeamStandings.losses,
                    otLosses: _TeamStandings.otLosses,
                    points: _TeamStandings.points,
                    pointsPctg: _TeamStandings.pointPctg
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

     async function GetStandingsName()
     {
        let _Result;
        switch(DIVISION){
            case "A":
                _Result = "Atlantic";
                break;
            case "C":
                _Result = "Central";
                break;
            case "M":
                _Result = "Metro";
                break;
            case "P":
                _Result = "Pacific";
                break;
            case "W":
                _Result = "Wild Card";
                break;
            default:
                break;
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

     async function sortCurrentStandings(_StandingData)
     {
        //StandingData is only the one set by Abbrev and not the full file.
        //THIS WORKS!!!
        let _SortedFile = null;
        _SortedFile = _StandingData.standings.sort(function(a,b){
            return compareString(a.divisionAbbrev, b.divisionAbbrev);
        })
        let startingNum;
        switch(DIVISION)
        {
            case "A":
                startingNum = 0;
                break;
            case "C":
                startingNum = 8;
                break;
            case "M":
                startingNum = 16;
                break;
            case "P":
                startingNum = 24;
                break;
            default:
                break;

        }
        let _Result = [];
        for(let i = 0; i < DIVISION_SIZE; ++i)
        {
            _Result.push(_StandingData.standings[startingNum]);
            ++startingNum;
        }
        console.log(_Result[3]);
        return _Result;

     }

     function compareString(a,b)
     {
        a = a.toLowerCase();
        b = b.toLowerCase();

        return (a < b) ? - 1 : (a > b) ? 1 : 0;

     }

     function getTeamData()
    {
       return {
            ARI:{
                logo: "https://www.thesportsdb.com/images/media/team/badge/3n1yqw1635072720.png"
            },
            ANA: {
            logo: "https://www.thesportsdb.com/images/media/team/badge/1d465t1719573796.png"
           },
           BOS:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/b1r86e1720023232.png"
           },
           BUF:{
            logo: "https://www.thesportsdb.com/images/media/team/badge/3m3jhp1619536655.png"
           },
           CGY:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/v8vkk11619536610.png"
           },
           CAR:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/v07m3x1547232585.png"
           },
           CHI:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/tuwyvr1422041801.png"
           },
           COL:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/wqutut1421173572.png"
           },
           CBJ:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/ssytwt1421792535.png"
           },
           DAL:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/qrvywq1422042125.png"
           },
           DET:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/1c24ow1546544080.png"
           },
           EDM:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/uxxsyw1421618428.png"
           },
           FLA:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/8qtaz11547158220.png"
           },
           LAK:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/w408rg1719220748.png"
           },
           MIN:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/swtsxs1422042685.png"
           },
           MTL:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/stpryx1421791753.png"
           },
           NSH:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/twqyvy1422052908.png"
           },
           NJD:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/z4rsvp1619536740.png"
           },
           NYI:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/hqn8511619536714.png"
           },
           NYR:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/bez4251546192693.png"
           },
           OTT:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/2tc1qy1619536592.png"
           },
           PHI:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/qxxppp1421794965.png"
           },
           PIT:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/dsj3on1546192477.png"
           },
           SJS:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/yui7871546193006.png"
           },
           SEA:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/zsx49m1595775836.png"
           },
           STL:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/rsqtwx1422053715.png"
           },
           TBL:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/swysut1421791822.png"
           },
           TOR:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/mxig4p1570129307.png"
           },
           UTA:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/zxfycs1718706518.png"
           },
           VAN:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/xqxxpw1421875519.png"
           },
           VGK:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/7fd4521619536689.png"
           },
           WSH:
           {
            logo: "https://www.thesportsdb.com/images/media/team/badge/7fd4521619536689.png"
           },
           WPG:
           {
            logo: "https://www.thesportsdb.com/team/134851-Winnipeg-Jets"
           }
        };
    }
     