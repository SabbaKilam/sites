/**
*   Author: Abbas Abdulmalik
*   Creation Date: July 29, 2015
*   Purpose: Links to Site for web developers
*   Modified: August 2, 2015
*   Notes:
*
*/
//=================prepare for unit test============
window.onload = function(){
    if(O("btnTest")){
        O("btnTest").onclick = function(){
            document.location = "test.html";
        }; 
        O("btnTest").onmouseover = function(){
            S(this).opacity = 1;
        };
        O("btnTest").onmouseout = function(){
            S(this).opacity = 0;
        };        
    }
  
makeDraggable(O("note"));
//=================main code goes here================
//instantiate sitesapi
var sites = sitesapi(),
    noteHolder = O("noteHolder");
    rawCsv = "",
    rawRecords = [],
    pureRecords = [],
    header = "",
    cardDeck = [],
    cardWidth = 200,
    cardHeight = 55,
    inMotion = false,
    inGroups = false
;
S(noteHolder).zIndex = -2;
var content = document.getElementById("content");
resizeNoteHolder();
window.addEventListener("resize", function(){
   resizeNoteHolder(); 
});
function resizeNoteHolder(){
    S(noteHolder).position = "absolute";
    S(noteHolder).height = px(innerHeight + scrollTop()); //scrollTop found in OSCD.js
    S(noteHolder).width = px(innerWidth + scrollLeft());  //scrollLeft found in OSCD.js  
}

setInterval(resizeNoteHolder,110);
//----------------------------------------
setInterval(updateCards, 500);
function updateCards(){
    cardDeck.forEach(function(m,i,a){
        var rect = m.card.getBoundingClientRect();
        m.x = rect.left + scrollLeft();
        m.y = rect.top + scrollTop();
    });
}
//=========DECLARATIONS=========
sites.getCsv(processCsv);    //get data using api

//=========UNDER THE HOOD======== 
//This function we pass to the api object
function processCsv(rawData){      
    rawCsv = "";
    rawCsv = rawData;
    //stripHeader(buildGui); //so as not to build gui too early
    stripHeader();
    setTimeout(function(){  
        buildGui(function(){
            setEventHandlers(arrangeByGroups);
        });   
    },10);
    show(rawData);
    doCsvTests();
    //-----------------helpers ---------------
    function arrangeByGroups(){        
        setTimeout(function(){
            O("group").click();
        }, 10);        
    }
    //----------------------------------------
    function stripHeader(){
        rawRecords = rawCsv.split("\n");    //make raw records array    
        header = rawRecords[0].trim();      //copy header trimming white space
        pureRecords = rawRecords.slice(1);  //chop header; now only records exist
        pureRecords.forEach(function(e){
            e.trim();
        })
        pureRecords.sort();
        show(pureRecords);
    }
    //----------------------------------------------
    function buildGui(wireHandlers){
        var cardTop = -35;
        S(content).width = cardWidth + "px";
        for(var i=0 ; i < pureRecords.length; i++){
            var c = document.createElement("div"),
                title = pureRecords[i].split(",")[0],
                webLink = pureRecords[i].split(",")[1].trim(),
                imgPath = pureRecords[i].split(",")[2].trim(),
                group = pureRecords[i].split(",")[3].trim(),
                text = document.createTextNode(title),
                a = document.createElement("a"),
                img = document.createElement("img"),
                crlf = document.createElement("br"),
                cardObject = {}
                ;
            //---------------------------------
            c.setAttribute("class","card");     
            img.setAttribute("src", imgPath );
            img.setAttribute("width", "40px" );        
            a.appendChild(img);
            a.appendChild(crlf);
            a.setAttribute("href", webLink );
            a.setAttribute("target","_blank");// forces anchor to open a new tab
            S(a).textDecoration = "none";
            S(a).color = "lightgray";
            a.appendChild(text);
            c.appendChild(a);
            S(c).zIndex = i;
            S(c).width = cardWidth +"px";
            S(c).height = cardHeight +"px"
            S(c).padding = "15px";
            S(c).margin = "0 auto";        
            S(c).borderRadius = "8px";
            S(c).boxShadow = "5px 5px 15px black";
            S(c).fontWeight = "bold";
            cardTop += 35;
            S(c).top =  cardTop + "px";
            S(c).textAlign = "center";
            S(c).cursor = "move";
            
            var rect = c.getBoundingClientRect();
            cardObject.x = rect.left + scrollLeft();
            cardObject.y = rect.top + scrollTop();
            cardObject.card = c;
            cardObject.id = i;
            cardObject.url = webLink;
            cardObject.group = group;
            cardObject.title = title;
            cardObject.note = title +"\n"+ "Notes: ";
            cardDeck.push(cardObject);
            
            content.appendChild(c);
            makeDraggable(c);

        }//==END of loop creating cards and cardDeck==

        //----helpers-------
        function createACard(i){
        }
        //---------------------
        function fillInInfo(card){}
        //---------------------
        function appendCardToDom(card){}
        //---------------------
        function doGuiTests(){
            if(this.test !== undefined){
                test("========Building GUI=========", function(assert){
                    expect(3);
                    //----assertions below---------------- 
                    assert.deepEqual( (function(){return true})(),true,"Building GUI" ); 
                    assert.ok( typeof createACard(7) === 'object',"'card'' is an object" );
                    assert.deepEqual( (function(){return true})(),true,"Genertic deepEqual()" );
                    
                    //------------------------------------
                });
            } 
        }
        //---------------------
        if(wireHandlers){wireHandlers()};
        //---------------------------       
    }//==END of buildGui()==    
    //-----------------unit tests----------------------
    function doCsvTests(){
        if(this.test !== undefined){
            test("========Processing CSV data=======", function(assert){
                expect(4);
                //----assertions below---------------- 
                deepEqual((function(){return true})(),true,"Processing CSV data");                
                ok(pureRecords  .length === rawRecords.length -1,"Length of pure records one less than raw");
                ok(rawRecords.length !== 0,"Records array not empty");
                ok(header ==="title, siteurl, imgurl","proper header: title, siteurl, imgurl");
                //------------------------------------
            });}        
    }
    //------------------------------------------------    
    //-----------end of helpers-----------------------
}//==END of processCsv(rawData)==
    //-------------------------------
    function setEventHandlers(callback){
        cardDeck.forEach(function(e,i,a){
            e.card.addEventListener("mouseover", function(){
                if(inMotion){return}
                inMotion = true;
                fastSlow();    
                S(e.card).cursor = "move";
                S(e.card).boxShadow = "2px 2px 2px hsla(203, 86%, 42%, 0.8)";
                S(e.card).border = "1px solid hsla(203, 86%, 42%, 1.00)";                
                S(e.card).width = (e.card.offsetWidth - 30) + "px";
                S(e.card).height = (e.card.offsetHeight - 25) + "px";                
                cardDeck.forEach(function(f){S(f.card).zIndex = 0;}); 
                S(e.card).zIndex = cardDeck.length +1;
            });          
        })
        //---------------------------------
        cardDeck.forEach(function(e,i,a){
            e.card.addEventListener("mouseout", function(){
                inMotion = false;
                fastSlow();
                S(e.card).width = cardWidth + "px";
                S(e.card).height = cardHeight + "px";
                S(e.card).boxShadow = "5px 5px 15px black";
                S(e.card).border = "none";                 
                cardDeck.forEach(function(f,i){S(f.card).zIndex = i+1;})                 
            });
        });
        //----------------------------------
        cardDeck.forEach(function(e,i,a){
            e.card.addEventListener("mousedown", function(){
                S(e.card).cursor = "pointer";
            });
        });
        //---------------------------------- 
        cardDeck.forEach(function(e,i,a){
            e.card.addEventListener("mouseup", function(){
                S(e.card).cursor = "move";
            });
        });
        //------------------------------------
        cardDeck.forEach(function(m,i,a){
            m.card.addEventListener("dblclick", function(e){                
                var e = e || window.event;
                e.stopPropagation(); 
                e.preventDefault();
                    showNoteWindow();
                //---------helper------------
                function showNoteWindow(){                    //http://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element                    
                    var rect = m.card.getBoundingClientRect();
                    //----------------------------
                    S("note").left = px(rect.left + scrollLeft());
                    S("note").top = px(rect.top + scrollTop());
                    S("note").width = px(m.card.offsetWidth - 10);
                    S("note").height = px(m.card.offsetHeight - 10);
                    S("note").zIndex = cardDeck.length + 2;                 
                    O("note").setAttribute("data-id", m.id );
                    S(noteHolder).zIndex = cardDeck.length +2;
                    S(noteHolder).visibility = "visible";
                    if(m.note === ""){
                        O("note").value = m.title +"\n"+ "Notes: ";
                    }
                    else{
                        O("note").value = m.note;                         
                    }
                    S("note").visibility = "visible";
                    O("note").focus();
                    //===========blur background??=====
                    blurBackground();
                    //===================================
                }                
            },false);
        });
         //------------------
            O("note").addEventListener("mousedown",function(e){
                e.stopPropagation();
                //e.preventDefault();
            })         
         //------------------
            O("note").addEventListener("click",function(e){
                e.stopPropagation();
                e.preventDefault();                
            })         
         //------------------         
         O("note").addEventListener("dblclick", function(e){
             e.stopPropagation();
            cardDeck[parseInt(this.getAttribute("data-id"))].note = this.value;
            this.setAttribute("data-id","");
            S(noteHolder).zIndex = -1;
            S(noteHolder).visibility = "hidden";
            S("note").visibility = "hidden";
            sharpenBackground();
         });
         O("noteHolder").addEventListener("click", function(){
             saveNote();
             sharpenBackground();
         });
         //--------
         function saveNote(){
            cardDeck[parseInt(O("note").getAttribute("data-id"))].note = O("note").value;
            O("note").setAttribute("data-id","");
            S(noteHolder).zIndex = -1;
            S(noteHolder).visibility = "hidden";
            S("note").visibility = "hidden";
            sharpenBackground();   
         }
        //==========================================   
        O("stack").addEventListener("click", function(){
            if(inGroups){groupToContents();}
            S("groups").visibility = "hidden";
            //cardDeck.reverse();
            var top = -35;
            inMotion = false;
            fastSlow();
            cardDeck.forEach(function(e,i,a){
                top+=35;
                S(e.card).top = px(top);
                S(e.card).left = 0;                
            });
        });
        //---------------------------------- 
        O("spread").addEventListener("mousedown", function(){
            if(inGroups){groupToContents();}
            S("groups").visibility = "hidden";            
            var xOdd1 = 0,
                xOdd2 = 0,
                xEven1 = 0,
                xEven2 = 0,
                oddArray = [],
                evenArray =[],
                dy = 35,
                y = -35
            ;
            //----------------------------
            //cardDeck.reverse();
            xOdd1 = (-1)*cardDeck[0].card.offsetWidth/2;
            xOdd2 = (-3/2)*cardDeck[0].card.offsetWidth;
            xEven1 = cardDeck[0].card.offsetWidth/2;
            xEven2 = (3/2)*cardDeck[0].card.offsetWidth;
            oddArray.push(xOdd1);
            oddArray.push(xOdd2);
            evenArray.push(xEven1);
            evenArray.push(xEven2);
            //----------------------------------------
            cardDeck.forEach(function(e,i,a){
                if( e.id%2 === 0){
                    S(e.card).left = evenArray[0] +"px";
                    evenArray.push(evenArray.shift());                
                }
                else{
                    S(e.card).left = oddArray[0] + "px";
                    oddArray.push(oddArray.shift());                 
                }
                y += dy;
                S(e.card).top = y + "px";
            });
        });
        //---------------------------------------
        //O("btnRefresh").addEventListener("click",getAndStoreData );
        O("btnRefresh").addEventListener("mouseover",function(){
            S(this).opacity = 1;
        } );
        //---------------------------------------
        O("btnRefresh").addEventListener("mouseout",function(){
            S(this).opacity = 0;
        } );
        //---------------------------------------
        O("btnRefresh").addEventListener("click",function(){
            var clearStorage = confirm("Okay to remove notes too?");            
            if(clearStorage && window.localStorage){localStorage.clear()}
            document.location.assign("");
        } );        
        //----------------------------------
        O("group").addEventListener("click", function(){
            inMotion = false;
            fastSlow();            
            O("stack").click();//looks a mess without first "stackin''em":research!
            S("groups").visibility = "visible";
            groupThem();
        });
            function groupThem(){
                O("groups").innerHTML = "";
                var groupArray = sites.getGroups();
                createGroupDivs(groupCards);//helpers below
                //--------helpers------------
                function createGroupDivs(callback){
                    var fullName = {
                        "FED": "Front End Development",
                        "FSD": "Full Stack Development",
                        "GEN": "General Web Resources",
                        "OLL": "Online Learning Sites",
                        "RPL": "REPL Language Consoles"                    
                        },
                        left = -16
                    ;
                    //-----------------------
                    groupArray.forEach(function(m,i,a){
                        var newDiv = document.createElement("div");
                        newDiv.setAttribute("id",m);
                        S(newDiv).position = "absolute";
                        S(newDiv).display = "inline-block";
                        S(newDiv).textAlign = "center";
                        S(newDiv).fontWeight = "bold";
                        S(newDiv).marginTop = "0.05%";                    
                        
                        left += 19;
                        S(newDiv).left = left + "%";                
                        newDiv.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;"+fullName[m];
                        O("groups").appendChild(newDiv);
                    });
                    if(callback){callback()};
                }
                //--------------------------------
                function groupCards(){
                    inMotion = false;
                    fastSlow();
                    cardDeck.forEach(function(m,i,a){
                        m.y = -cardHeight;//initialize top style value
                    });
                    cardDeck.forEach(function(m,i,a){
                        groupArray.forEach(function(n,j,b){
                            if(n === m.group){
                                O(n).appendChild(m.card);
                                cardDeck.forEach(function(p,k,c){
                                    if( p.group ===  n){p.y = p.y + (1.5)*cardHeight;}
                                })
                                if(m.group === "GEN"){
                                    //because there are more "general" websites ...
                                    //stack them more tightly
                                    S(m.card).top = px(0.88*m.y);                                     
                                }
                                else{
                                    S(m.card).top = px(m.y);                                    
                                }
                            }
                        })
                    });
                }
                //--------------------------------
                inGroups = true;
            }//==END of groupThem()==
        //-------------------------------------

        //---last statement of setEventHandlers calls callback:----
        if(callback){callback();}
    }//==END setEventHandlers()==
    //--------------------update cardDeck----------------
    function getAndStoreData(){
        cardDeck = [];
        O("content").innerHTML = "";
        O("groups").innerHTML = "";
        sites = sitesapi();
        sites.getCsv(processCsv);
    }//==END of storeCardsLocal==
    //--------------------------------
    function groupToContents(){
        var groupArray = sites.getGroups();
        cardDeck.forEach(function(cardObject,i,a){
            groupArray.forEach(function(groupName,j,b){
                if(groupName === cardObject.group){
                    O(groupName).removeChild(cardObject.card);
                    O("content").appendChild(cardObject.card)
                }
            })
        });
        inGroups = false;
    }

    //------------------------------
    function fastSlow(){
        if(inMotion){
            C("card").forEach(function(m){
                S(m).webkitTransition = "top 0s, left 0s ";
                S(m).mozTransition = "top 0s, left 0s ";
                S(m).oTransition = "top 0s, left 0s ";
                S(m).msTransition = "top 0s, left 0s";
                S(m).transition = "top 0s, left 0s";
            });
        }
        else{
            C("card").forEach(function(m){
                S(m).webkitTransition = "top 0.3s, left 0.3s ";
                S(m).mozTransition = "top 0.3s, left 0.3s ";
                S(m).oTransition = "top 0.3s, left 0.3s ";
                S(m).msTransition = "top 0.3s, left 0.3s ";
                S(m).transition = "top 0.3s, left 0.3s ";
            }); 
        }
    }//==END of fastSlow()==
};//==END of window.onload()==

//========================load prior page============================
function loadPriorPage(){
    if(supportsLocalStorage()){
        if(storedTopicExists()){
            loadStoredTopic();
        }
        else{           
           loadTopic(1);
           storeTopic("topic1");            
        }
    }
    else{
        loadTopic(1);
    }
    //----------internal helpers---------
    function supportsLocalStorage(){        
        return !!(window.localStorage)
    }
    //------------------------------
    function storedTopicExists(){
        var topicStoredFlag = false;
        //code here
        topicStoredFlag = !!localStorage.getItem('topic');
        return topicStoredFlag;
    }
    //----------------------------------
    function loadTopic(num){
         O("topic" + num).click();
    }
    //----------------------------------
    function loadStoredTopic(){
        O(localStorage.getItem('topic')).click();
    }
    //----------------------------------
}
//==External helpers for loadPriorPage() & click event handlers
function supportsLocalStorage(){        
    return !!(window.localStorage);
}
//------------------------------
function storeTopic(topic){
    if(supportsLocalStorage()){
        localStorage.setItem('topic',topic);
    }
}
//----------------------------------
function px(obj){
    return obj + "px"
}
//////////////////////////////////////
function sharpenBackground(){
    S("groups").webkitFilter = "none";
    S("groups").mozFilter = "none";
    S("groups").oFilter = "none";
    S("groups").msFilter = "none";
    S("groups").filter = "none"; 

    S("content").webkitFilter = "none";
    S("content").mozFilter = "none";
    S("content").oFilter = "none";
    S("content").msFilter = "none";
    S("content").filter = "none";
}
//-------------------------------------
function blurBackground(){
    S("groups").webkitFilter = "blur(1.2px)";
    S("groups").mozFilter ="blur(1.2px)";
    S("groups").oFilter = "blur(1.2px)";
    S("groups").msFilter = "blur(1.2px)";
    S("groups").filter = "blur(1.2px)";

    S("content").webkitFilter = "blur(1.2px)";
    S("content").mozFilter = "blur(1.2px)";
    S("content").oFilter = "blur(1.2px)";
    S("content").msFilter = "blur(1.2px)";
    S("content").filter = "blur(1.2px)";
}
//----try to override anchor defaults====

