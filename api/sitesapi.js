window.addEventListener("load", function(){
    console.log("The SiteOfSites api is now loaded.\nCategories: " + (sitesapi()).getGroups());
});
//-----------SiteOfSite api is defined below------------------------------
function sitesapi(){
    var groups = [
        "FED",  //front end development
        "FSD",  //full stack development
        "GEN",  //general web dev resource
        "OLL",  //on-line learning
        "RPL"   //REPL for programming languages       
    ],  apiObject = {
            getCsv: function getCsv(userCallback){
                var ajax = new XMLHttpRequest();
                ajax.addEventListener("readystatechange", function(){
                    if(ajax.readyState === 4){
                        if(ajax.status === 200 || ajax.status === 0){
                            userCallback(ajax.response);
                        }
                        else{
                            console.log("Trouble getting CSV file")
                        }
                    }
                });
                //--------------------
                ajax.open("GET", "sites.csv", true);
                ajax.send(null);
                return true;
            },//==END of getCsv(func)==
            addSite: function addSite(siteString){},
            getGroups: function getGroups(){
                return groups;
            }
        }//==END of apiObject==
    ;
    //========================
    return apiObject
    //======helpers======
} 
