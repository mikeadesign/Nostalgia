var imagearray = new Array();
var index = 0;
var bannershown =0;
var pagenum =1;
var imagespulled =0;
var imagesprocessed=0;
var componentnames = new Array();


enyo.kind({
    name: "NostalgiaApp1",
    kind: "Control",
    components: [
        { name: "OAuth1", kind: "OAuth" },
		{kind: "WebService", name:"searchimages", onSuccess: "queryResponsedeals", onFailure: "queryFail"},
		{kind: "WebService", name:"imagetags", onSuccess: "queryImageTags", onFailure: "queryFail"},
        { name: "webService1", kind: "WebService",
            onSuccess: "webService1AccessSuccess",
            onFailure: "webService1Failure",
            components: [
                {
                    method: "POST",
                    handleAs: "json",
                    contentType: "application/x-www-form-urlencoded"
                }
            ]
        },
        {kind: "ApplicationEvents", onWindowRotated: "RotateD"},        
        {kind: "Control", name:"LoginPanel", layoutKind: "HFlexLayout",
            pack: "left", align: "start", components: [ //style:" z-index: 100;",


//            {name: "Prefs", kind: "Popup", onCancel: "closePopupPrefs", components: [
                {kind: "RowGroup", name:"LoginScreen",align:"center",caption: "Enter your login/email id and password  ",style:"width:326px; margin:10px auto;", 
                components:[
                    {name: "username",kind: "Input",hint:"email id",style:"font-size:12px;width:354",onfocus:"checkkb"}, 
                    {name: "password",kind: "PasswordInput",hint:"password",style:"font-size:12px;width:350px",onfocus:"checkkb"}, 
                    {kind: "HFlexBox", style: "padding-top: 6px;", components: [
                        {name: "loginbutton", kind: "Button", caption: "Login", style:"font-size:12px;width:300px", onclick: "loginToTwitter"}, //,
                    ]},
                ]},
  //              ]}


            /*    {kind: "VFlexBox", components: [
                    {name: "username",kind: "Input",hint:"username",style:"font-size:12px;width:175px",onfocus:"checkkb"}, 
                    {name: "password",kind: "PasswordInput",hint:"password",style:"font-size:12px;width:175px",onfocus:"checkkb"}, 
                    {name: "loginbutton", kind: "Button", caption: "Login", style:"font-size:12px;", onclick: "loginToTwitter"}, //,
                ]},
*/
                {kind: "VFlexBox", className: "leftRail", style: "margin-right:10px;", components: [
                    //{name: "loadbutton",kind: "Button",caption:"Load Images",style:"font-size:12px;width:175px",onclick:"getUserImages",showing:false}, 
                    {name: "search",kind: "Input",hint:"search",style:"font-size:12px;width:175px",onfocus:"checkkb",showing:false}, 
                    {name: "searchbutton",kind: "CustomButton",caption:"Search Now",className: "searchBtn",onclick:"getImages",showing:false}, 
                    {name: "momentbutton",kind: "CustomButton",caption:"Save Moment",className: "saveBtn",onclick:"saveMoment",showing:false}, 
                ]},
                {kind: "VFlexBox", className: "imageList", name:"imageBox",layoutKind: "VFlexLayout",flex:1, components: [
                   /* {flex: 1, kind: "VirtualList", name:"imagethumbnails", components: [
                        {kind: "Image", content: "An Item",
                            onmousehold: "itemMousehold", onmouserelease: "itemMouserelease",
                            ondragstart: "itemDragStart", ondrag: "itemDrag", ondragfinish: "itemDragFinish"}
                    ]}*/
                    {kind: "Control", name:"imagethumbnails",flex:1},
                ]},
//END Of HFlex Components 
        ]},
//        {kind: "Image", name:"imagescreen",flex:1,onLoadStopped:"CheckAuth",onLoadComplete:"CheckAuth",onPageTitleChanged:"pageTitleChanged"},
//        {kind: "ImageView", name:"imageview", flex:1, onSnap:"snap",onGetLeft: "getLeft", onGetRight: "getRight"},

        {name: "fancyPopup", kind: "Popup", showHideMode: "transition", openClassName: "rotateFadeIn", 
			className: "fastAnimate transitioner2", layoutKind: "VFlexLayout",
			style: "overflow: hidden", width: "50%", height: "50%", components: [
//                {kind: "CanonFancySliding", flex: 1}
            {kind: "HtmlContent", name:"loggingin",content: "Logging in..."},
            {kind: "WebView", name:"loginscreen",flex:1,onLoadStopped:"CheckAuth",onLoadComplete:"CheckAuth",onPageTitleChanged:"pageTitleChanged"}
        ]},
        
        {name: "fancyImagePopup", kind: "Popup", showHideMode: "transition", openClassName: "rotateFadeIn", 
			className: "fastAnimate transitioner2", layoutKind: "VFlexLayout",
			style: "overflow: hidden", width: "75%", height: "75%", components: [
//                {kind: "CanonFancySliding", flex: 1}
            {kind: "Image", name:"clickedImage",flex:1, style: "width: 100%; height: 100%"} //,src:"http://i1111.photobucket.com/albums/h469/webosappsforyou/grupo_2011-26-07_192701.png"}
        ]},
        {kind: "Popup",name:"momentPopup", onBeforeOpen: "beforePopupOpen", layoutKind: "VFlexLayout", 
                        height: "500px", width: "500px", components: [
        {content: "Select the images to include in your moment"},
        {kind: "Scroller", flex: 1, components: [
          {name: "list", kind: "VirtualRepeater", onSetupRow: "getListItem",
              components: [
                  {kind: "Item",  Layout: "HFlexLayout", align: "center", style: "display: -webkit-box; -webkit-box-orient: horizontal;",
                      components: [
                          // {name: "title", kind: "Divider"},
                          {name: "description", kind: "Image"},
                          {kind: "Spacer"},
                          {kind: "CheckBox", style: "margin: 3px 0 0 -33px;"}
                          ],
                      onclick: "listItemClick"
                  }
              ]
          }
            ]},
                  {name: "savebutton", kind: "Button", caption: "Save", style:"font-size:12px;width:300px", onclick: "savetoServer"}
        ]},

        
    ],
   
    create: function() {
      this.inherited(arguments);
      this.results = [];
    },
	queryImageTags: function(inSender, inResponse) {
        console.log(enyo.json.stringify(inResponse));
		this.datadeals = inResponse.deals;
        //console.log(this.datadeals);
		//this.$.deallist.refresh();
	},
	queryResponsedeals: function(inSender, inResponse) {
        console.log(inResponse);
		this.datadeals = inResponse.deals;
        //console.log(this.datadeals);
		//this.$.deallist.refresh();
	},

	saveMoment: function(inSender) {
    
            this.$.momentPopup.openAtCenter();


	},

    queryFail:function (inSender, inResponse) {
    
    console.log("Query Failed");
    console.log(inResponse);
    
    },
    webService1AccessSuccess: function(inSender, inResponse, inRequest)
    {
        console.log(inResponse);
       
      var token = this.$.OAuth1.decodeForm(inResponse);
      var oauth_token = token[0][1];
      var oauth_token_secret = token[1][1];
      var username = token[2][1];
//      console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUU");
//      console.log(username);
      this.accessor = { oauthToken: oauth_token, consumerSecret: this.access.consumerSecret, tokenSecret: oauth_token_secret};

      console.log(this.accessor);
      enyo.setCookie("AuthTokens", enyo.json.stringify(this.accessor));
      console.log(inResponse.next_step);
      this.$.fancyPopup.openAtCenter();
      this.$.loginscreen.setUrl("http://photobucket.com/apilogin/login?oauth_token=" + this.accessor.oauthToken );
      //this.$.loginscreen.setUrl("http://www.rodtsampson.com/Nostalgia/fbauth.php");
      console.log(this.$.loginscreen.getUrl());
      //this.$.loginscreen.setUrl("http://www.google.com");
      //this.$.loginscreen.reloadPage();
      //this.$.loginscreen.setUrl("http://google.com");
      console.log(this.$.loginscreen.getUrl());
      
      //Remove the comment from the lines below for testing it on your computer.
      //  this.$.fancyPopup.close();
     /*   this.$.loginbutton.setShowing(false);
        this.$.search.setShowing(true);
        this.$.searchbutton.setShowing(true);
        bannershown = 1;

        this.access = {};
        this.access = {
            consumerKey: "149831754", //"Yj3jl7d1C8SFXvqUkscDQ",
            consumerSecret: "ed94895c3d62bd0620cc37ff4ead5d34", //"lBnxd1Z0PNeKrmjg5w6dr6ngPVUPox7y8ejQl2ts90",
            requestTokenURL: "http://api.photobucket.com/login/access" //+ encodeURIComponent(this.$.search.getValue()) +"/image?format=json&page=" + pagenum, 
        };

        var cookieContents = enyo.getCookie("AuthTokens");
        this.accessor = enyo.json.parse(cookieContents);

        this.par = {};
        this.par = {
            oauth_signature: "",
            oauth_nonce: "",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.access.consumerKey,
            oauth_token: this.accessor.oauthToken,
            oauth_timestamp: "",
            oauth_version: "1.0" //,
            //status: "TestStatus"
        };
        this.message = {action: this.access.requestTokenURL, method: "POST", parameters: [] };
        this.message.parameters = this.par;

        this.message = this.$.OAuth1.setTimestampAndNonce(this.message);
        this.message = this.$.OAuth1.sign(this.message, this.accessor);
        this.message.action = this.$.OAuth1.addToURL(this.message.action, this.message.parameters);
       
        console.log(this.message.action);
        this.$.webService1.setUrl(this.message.action);
        this.$.webService1.setMethod(this.message.method);
        this.$.webService1.setHeaders({Authorization: "OAuth"});
        this.$.webService1.call({},{onSuccess: "webServiceAPostSuccess"});

*/



























      
    },

    webService1PostSuccess: function(inSender, inResponse, inRequest)
    {
        //console.log(inResponse.content.result.primary.media);
        imagearray = [];
        imagespulled = inResponse.content.result.primary.media.length;
        console.log(componentnames.length);
/*        for (var i=0;i<componentnames.length;i++) {
                console.log(componentnames[i]);
                //this.$.imagethumbnails.destroyComponent(componentnames[i]);
                var compname = componentnames[i];
                componentnames[i].destroy();
        }
*/      
        //this.$.NostalgiaApp.destroyComponent(this.$.imagethumbnails);
        //this.$.NostalgiaApp.createComponent({kind: "Control", name:"imagethumbnails",flex:1}, {owner: this});

        if(this.$.imagethumbnails)  {
        
            this.$.imagethumbnails.destroy();
            console.log("Destroyed");

        }

        this.$.imageBox.createComponent({kind: "Control", name:"imagethumbnails",flex:1},{owner: this});
        
        componentnames = [];
        var imagethumbs = "";

        
        for(var i=0; i < inResponse.content.result.primary.media.length; i++) {
            
            //imagearray.push(inResponse.content.result.primary.media[i].url);
            console.log(imagearray.length);
           //Commenting out Geo data search svsvsvsv
           // this.getGeodata(inResponse.content.result.primary.media[i].url);

            //var imagecomp = {kind: "Image",name:"" + inResponse.content.result.primary.media[i].url + "" ,  
            //style: "width: 100px; height: 100px",src: "\'" + inResponse.content.result.primary.media[i].thumb + "\'", onclick:"openImage" }
            
            console.log(enyo.json.stringify(inResponse.content.result.primary.media[i]._attribs.uploaddate));
            
            var incomingUTCepoch = inResponse.content.result.primary.media[i]._attribs.uploaddate;
            var utcDate = new Date(incomingUTCepoch*1000);
            var date = new Date();
            
            date.setUTCDate(utcDate.getDate());
            date.setUTCHours(utcDate.getHours());
            date.setUTCMonth(utcDate.getMonth());
            date.setUTCMinutes(utcDate.getMinutes());
            date.setUTCSeconds(utcDate.getSeconds());
            date.setUTCMilliseconds(utcDate.getMilliseconds());
            console.log(date);
            
            
            if(this.$.dtDate) {
            console.log(this.$.dtDate - date);
            
            this.results = [];
            
            var days_diff = this.days_between(this.$.dtDate, date)
            
                if(days_diff < 1 ) {
                
                    this.$.imagethumbnails.createComponent({kind: "Image",name:"" + inResponse.content.result.primary.media[i].url + "" ,  
                    style: "width: 100px; height: 100px",src: "\"" + inResponse.content.result.primary.media[i].thumb + "\"", onclick:"openImage" }, {owner: this});
                    this.$.imagethumbnails.render();
                    componentnames.push(inResponse.content.result.primary.media[i].url);

                
                    var thumbnail = inResponse.content.result.primary.media[i].thumb;
                    this.results[i] = {description: thumbnail};
                    //this.$.list.render();



                }

            }
            else {

                    this.$.imagethumbnails.createComponent({kind: "Image",name:"" + inResponse.content.result.primary.media[i].url + "" ,  
                    style: "width: 100px; height: 100px",src: "\"" + inResponse.content.result.primary.media[i].thumb + "\"", onclick:"openImage" }, {owner: this});
                    this.$.imagethumbnails.render();
                    componentnames.push(inResponse.content.result.primary.media[i].url);

 
 
                    var thumbnail = inResponse.content.result.primary.media[i].thumb;
                    this.results[i] = {description: thumbnail};
                    //this.$.list.render();

 
 
                       
            }
            



            
            // finally, load the data
            ImageInfo.loadInfo(inResponse.content.result.primary.media[i].url, this.$.mycallback);    
            //this.$.imagetags.setUrl("http://img2json.appspot.com/go/?callback=queryImageTags&url=" + inResponse.content.result.primary.media[i].url);
            //this.$.imagetags.call();
            

            //this.getTSdata(inResponse.content.result.primary.media[i].url);
			/*this.$.imagethumbnails.createComponent({kind: "HFlexBox", align: "center", tapHighlight: false, components: [
				{kind: "CheckBox", checked: true, style: "margin-right:10px"},
				{content: "Get kids to school"}
			]});
            this.$.imagethumbnails.render();
*/



//            this.$.imagescreen.setSrc(inResponse.content.result.primary.media[i].url);
        
        }


        //Add More Button and Date Button
            this.$.imagethumbnails.createComponent({kind: "HFlexBox", components: [{kind: "CustomButton",caption:"See More Images",className:"showMore",name:"MoreButton",
            onclick:"GetMoreImages",showing:true},
            {kind: "DatePicker", name:"datePicker",className: "picker-hbox", onChange: "dateChanged"}]}, {owner: this});
            //this.$.imagethumbnails.render();
 //           this.$.imagethumbnails.createComponent({kind: "DatePicker", className: "picker-hbox"}, {owner: this});
            this.$.imagethumbnails.render();

        /*if(imagearray.length == 0) {
            pagenum++;
            this.getImages();
        }*/
        
        index = 0;
    },

    getListItem: function(inSender, inIndex) {
      var r = this.results[inIndex];
      if (r) {
          // this.$.title.setCaption(r.title);
          // this.$.title.setCaption(r.description);
          // this.$.description.setContent(r.description);
          this.$.description.setSrc(r.description);
          return true;
      }
    },


    days_between: function (date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)
    
    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

    },
    
    dateChanged: function(inSender) {
         // the date picker date has changed....do something
         this.$.dtDate = this.$.datePicker.getValue();
         console.log("Date has changed to " + this.$.dtDate + ".");
         pagenum = 1;
         this.getImages();
    },
      
    dragImage: function(inSender, inResponse, inRequest)
    {
    
                console.log(inSender);
                //this.getImages();


    },

    GetMoreImages: function(inSender, inResponse, inRequest)
    {
    
                pagenum++;
                this.getImages();


    },
    webServiceAPostSuccess: function(inSender, inResponse, inRequest)
    {


        console.log(inResponse);
       
      var token = this.$.OAuth1.decodeForm(inResponse);
      var oauth_token = token[0][1];
      var oauth_token_secret = token[1][1];
      var username = token[2][1];
      console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUU");
      console.log(username);
      this.accessor = { oauthToken: oauth_token, consumerSecret: this.access.consumerSecret, tokenSecret: oauth_token_secret};

      console.log(this.accessor);
      enyo.setCookie("AuthTokens", enyo.json.stringify(this.accessor));
      enyo.setCookie("username", username);
      console.log(inResponse.next_step);
        this.getUserImages();



    },


    webService2PostSuccess: function(inSender, inResponse, inRequest)
    {
        //console.log(inResponse);
        //console.log(inSender);
        //console.log(inRequest);
        //if (typeof inResponse.content.latitude != 'undefined') {
        if ('content' in inResponse) {
            console.log(inResponse.content.latitude);
            var temp = inRequest.url.substring(33);
            var temp1 = decodeURIComponent(temp.substring(0,temp.indexOf("/geo?format=json")));
            console.log(temp1);
            imagearray.push(temp1);
        }
        console.log(imagearray.length);
        imagesprocessed++;
        
        if (imagespulled == imagesprocessed) {
            imagesprocessed = 0;
            if (imagearray.length == 0) {
                pagenum++;
                this.getImages();
            }
            else {
                //this.$.imageview.setCenterSrc(imagearray[0]);
                pagenum=1;
            }
        
        }
/*        imagearray = [];
        for(var i=0; i < inResponse.content.result.primary.media.length; i++) {
            
            this.getGeodata(inResponse.content.result.primary.media[i].url);
            imagearray.push(inResponse.content.result.primary.media[i].url);
            console.log(imagearray.length);
//            this.$.imagescreen.setSrc(inResponse.content.result.primary.media[i].url);
        
        }
        this.$.imageview.setCenterSrc(imagearray[0]);
        index = 0;*/
    },


    webService4PostSuccess: function(inSender, inResponse, inRequest)
    {
        //console.log(inResponse);
        //console.log(inSender);
        //console.log(inRequest);
        //if (typeof inResponse.content.latitude != 'undefined') {
        console.log(enyo.json.stringify(inResponse));
        
/*        imagearray = [];
        for(var i=0; i < inResponse.content.result.primary.media.length; i++) {
            
            this.getGeodata(inResponse.content.result.primary.media[i].url);
            imagearray.push(inResponse.content.result.primary.media[i].url);
            console.log(imagearray.length);
//            this.$.imagescreen.setSrc(inResponse.content.result.primary.media[i].url);
        
        }
        this.$.imageview.setCenterSrc(imagearray[0]);
        index = 0;*/
    },



    webService3PostSuccess: function(inSender, inResponse, inRequest)
    {
        console.log(enyo.json.stringify(inResponse));
        console.log(inSender);
        console.log(inRequest);
        //if (typeof inResponse.content.latitude != 'undefined') {
        imagearray = [];
        //this.$.imagethumbnails.setContent("");
        var imagethumbs = "";


        console.log(componentnames.length);
/*        for (var i=0;i<componentnames.length;i++) {
                console.log(componentnames[i]);
                //this.$.imagethumbnails.destroyComponent(componentnames[i]);
                var compname = componentnames[i];
                componentnames[i].destroy();

        }
*/        componentnames = [];
 //       if(this.$.imagethumbnails)
        //this.$.NostalgiaApp.destroyComponent(this.$.imagethumbnails);
        if(this.$.imagethumbnails)  {
        
            this.$.imagethumbnails.destroy();
            console.log("Destroyed");

        }
        /*
        var c = new enyo.Component({
            kind: "Control", 
            name: "imagethumbnails",
            flex:1
        },{owner: this});
        */
        this.$.imageBox.createComponent({kind: "Control", name:"imagethumbnails",flex:1},{owner: this});
            //this.$.inherited(arguments);
            //this.$.NostalgiaApp.createComponent({kind: "Control", name:"imagethumbnails",flex:1}, {owner: this});
/*        if(this.$.NostalgiaApp) {

            this.$.NostalgiaApp.createComponent({kind: "Control", name:"imagethumbnails",flex:1}, {owner: this});
        
        }
        else {



        
        }
*/
        for(var i=0; i < inResponse.content.album.media.length; i++) {
            
            //this.getGeodata(inResponse.content.album.media[i].url);
            imagearray.push(inResponse.content.album.media[i].url);
            //imagethumbs += "<img src=\"" + inResponse.content.album.media[i].thumb + "\" onclick=openImage(\"" + inResponse.content.album.media[i].url + "\") />   ";
//            this.$.imagethumbnails.createComponent({kind: "IconButton",name:"icon" + i ,  style: "width: 100px; height: 100px",icon: "\'" + inResponse.content.album.media[i].thumb + "\'", onclick:"openImage"});
            //this.$.imagethumbnails.createComponent({layoutKind: "VFlexLayout", name:"Imagebox",style: "height: 500px;", components: []}); ,style: "height: 500px;"s
            this.$.imagethumbnails.createComponent(//{layoutKind: "VFlexBox", components: [
            {kind: "Image",name:"" + inResponse.content.album.media[i].url + "" ,  style: "width: 100px; height: 100px",src: "\"" + inResponse.content.album.media[i].thumb + "\"", onclick:"openImage"},{owner: this});
//            {kind: "CheckBox", checked: false, style: "margin-right:10px"}]},
            this.$.imagethumbnails.render();
            //imagethumbs += "{kind: \"IconButton\",name:icon" + i + " icon: \"" + inResponse.content.album.media[i].thumb + "\"}";
           // if((i+1)%3 == 0) {
           // imagethumbs +="<br>";
           // }
            componentnames.push(inResponse.content.album.media[i].url);
            
            console.log(imagearray.length);
//            this.$.imagescreen.setSrc(inResponse.content.result.primary.media[i].url);
        
        }
        console.log(imagethumbs);
        //this.$.imagethumbnails.setContent(imagethumbs);
       // console.log(imagearray[0]);
       // console.log(imagearray[1]);
       // console.log(imagearray[2]);
       // console.log(imagearray[3]);
       // console.log(imagearray[4]);
        
//        this.$.imageview.setCenterSrc(imagearray[0]);
        index = 0;
    },

    openImage: function(inSender) {
    
        console.log("Clicked");
        console.log(inSender.name);
        this.$.fancyImagePopup.openAtCenter();
        //this.$.clickedImage.setShowing(true);
        this.$.clickedImage.setSrc(inSender.name); // "\"" ++ "\"");
        
        

    
    },


    getImageUrl: function(inIndex) {
        var n = imagearray[inIndex];
        console.log("N");
        console.log(inIndex);
        console.log(imagearray.length);
        if (n) {
            return n;
        }
    },
    getLeft: function(inSender, inSnap) {
    console.log("left");
    console.log(inSender);
    console.log(inSnap);
        inSnap && index--;
        return this.getImageUrl(index-1);
    },
    getRight: function(inSender, inSnap) {
    console.log("right");
    console.log(inSender);
    console.log(inSnap);
        inSnap && index++;
        return this.getImageUrl(index+1);
    },

    CheckAuth: function (inSender, inTitle, inUrl, inBack, inForward, inResponse)
    {
        console.log("test");
    console.log(inSender);
    console.log(inTitle);
    console.log(inUrl);
    console.log(inBack);
    console.log(inForward);
    console.log(inResponse);
        //console.log(inRequest);
        //console.log(inSender);
    },
    pageTitleChanged: function (inSender, inTitle, inUrl, inBack, inForward, inResponse) {
    //if inUrl starts with redirectUrl, you would have got your access token
    console.log("we are here");
    console.log(inSender);
    console.log(inTitle);
    console.log(inUrl);
    console.log(inBack);
    console.log(inForward);
    console.log(inResponse);
    if (inTitle.search("complete") != -1 && bannershown ==0 ) {
        
        enyo.windows.addBannerMessage("Logged in to Photobucket.com", "{}");
        this.$.fancyPopup.close();
        this.$.LoginScreen.setShowing(false);
        //this.$.loadbutton.setShowing(true);
        this.$.search.setShowing(true);
        this.$.searchbutton.setShowing(true);
        this.$.momentbutton.setShowing(true);
        bannershown = 1;
        //this.post2();
         //this.$.loginscreen.setUrl("http://google.com" );
        //this.$.searchimages.setUrl("http://api.photobucket.com/search/me/image?format=xml");
		//this.$.searchimages.call();

        //this.$.imagescreen.setUrl("http://api.photobucket.com/search/me/image?format=xml");

        this.access = {};
        this.access = {
            consumerKey: "149831754", //"Yj3jl7d1C8SFXvqUkscDQ",
            consumerSecret: "ed94895c3d62bd0620cc37ff4ead5d34", //"lBnxd1Z0PNeKrmjg5w6dr6ngPVUPox7y8ejQl2ts90",
            requestTokenURL: "http://api.photobucket.com/login/access" //+ encodeURIComponent(this.$.search.getValue()) +"/image?format=json&page=" + pagenum, 
        };

        var cookieContents = enyo.getCookie("AuthTokens");
        this.accessor = enyo.json.parse(cookieContents);

        this.par = {};
        this.par = {
            oauth_signature: "",
            oauth_nonce: "",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.access.consumerKey,
            oauth_token: this.accessor.oauthToken,
            oauth_timestamp: "",
            oauth_version: "1.0" //,
            //status: "TestStatus"
        };
        this.message = {action: this.access.requestTokenURL, method: "POST", parameters: [] };
        this.message.parameters = this.par;

        this.message = this.$.OAuth1.setTimestampAndNonce(this.message);
        this.message = this.$.OAuth1.sign(this.message, this.accessor);
        this.message.action = this.$.OAuth1.addToURL(this.message.action, this.message.parameters);
       
        console.log(this.message.action);
        this.$.webService1.setUrl(this.message.action);
        this.$.webService1.setMethod(this.message.method);
        this.$.webService1.setHeaders({Authorization: "OAuth"});
        this.$.webService1.call({},{onSuccess: "webServiceAPostSuccess"});
     }
    
    
    },

    webService1Failure: function(inSender, inResponse, inRequest)
    {
        console.log(inResponse);
        console.log(inRequest);
        console.log(inRequest.xhr.status);
    },

   loginToTwitter: function(){
        this.access = {};
        this.access = {
            consumerKey: "149831754", //"Yj3jl7d1C8SFXvqUkscDQ",
            consumerSecret: "ed94895c3d62bd0620cc37ff4ead5d34", //"lBnxd1Z0PNeKrmjg5w6dr6ngPVUPox7y8ejQl2ts90",
            requestTokenURL: "http://api.photobucket.com/login/request", //"https://api.twitter.com/oauth/access_token"
            userAuthorizationURL: "http://api.photobucket.com", 
            accessTokenURL: "http://api.photobucket.com"
        };
       
        this.accessor = {consumerSecret: this.access.consumerSecret, tokenSecret: ""};
       
        this.par = {};
        this.par = {
            oauth_callback: "oob",
            oauth_signature: "",
            oauth_nonce: "",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.access.consumerKey,
            oauth_timestamp: "",
            oauth_version: "1.0" //,
//            x_auth_mode: "client_auth" //,
//            x_auth_password: this.$.password.getValue(),
//            x_auth_username: this.$.username.getValue()
        };
        this.message = {action: this.access.requestTokenURL, method: "POST", parameters: [] };
        this.message.parameters = this.par;
        //this.accessor = {consumerSecret: this.access.consumerSecret, tokenSecret: ""};

        this.message = this.$.OAuth1.setTimestampAndNonce(this.message);
        this.message = this.$.OAuth1.sign(this.message, this.accessor);
        this.message.action = this.$.OAuth1.addToURL(this.message.action, this.message.parameters);
       
        this.$.webService1.setUrl(this.message.action);
        this.$.webService1.setMethod(this.message.method);
        //this.header = this.$.OAuth1.getAuthorizationHeader("",this.message.parameters);
        //this.$.webService1.setHeaders(this.header);
        this.$.webService1.setHeaders({Authorization: "OAuth"});
        this.$.webService1.call();
        console.log(this.message.action);
    },

    getImages: function(){
        this.access = {};
        this.access = {
            consumerKey: "149831754", //"Yj3jl7d1C8SFXvqUkscDQ",
            consumerSecret: "ed94895c3d62bd0620cc37ff4ead5d34", //"lBnxd1Z0PNeKrmjg5w6dr6ngPVUPox7y8ejQl2ts90",
            requestTokenURL: "http://api.photobucket.com/search/" + encodeURIComponent(this.$.search.getValue()) +"/image?format=json&perpage=40&page=" + pagenum, //"http://api.photobucket.com" //"http://api.twitter.com/1/statuses/update.json"
        };

        var cookieContents = enyo.getCookie("AuthTokens");
        this.accessor = enyo.json.parse(cookieContents);

        this.par = {};
        this.par = {
            oauth_signature: "",
            oauth_nonce: "",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.access.consumerKey,
            oauth_token: this.accessor.oauthToken,
            oauth_timestamp: "",
            oauth_version: "1.0" //,
            //status: "TestStatus"
        };
        this.message = {action: this.access.requestTokenURL, method: "GET", parameters: [] };
        this.message.parameters = this.par;

        this.message = this.$.OAuth1.setTimestampAndNonce(this.message);
        this.message = this.$.OAuth1.sign(this.message, this.accessor);
        this.message.action = this.$.OAuth1.addToURL(this.message.action, this.message.parameters);
       
        console.log(this.message.action);
        this.$.webService1.setUrl(this.message.action);
        this.$.webService1.setMethod(this.message.method);
        this.$.webService1.setHeaders({Authorization: "OAuth"});
        this.$.webService1.call({},{onSuccess: "webService1PostSuccess"});
    },


    getUserImages: function(){
        var cookieContents = enyo.getCookie("AuthTokens");
        this.accessor = enyo.json.parse(cookieContents);
        var username = enyo.getCookie("username");
        console.log("USER NAME USER NAME USER NAME");
        console.log(username);

        this.access = {};
        this.access = {
            consumerKey: "149831754", //"Yj3jl7d1C8SFXvqUkscDQ",
            consumerSecret: "ed94895c3d62bd0620cc37ff4ead5d34", //"lBnxd1Z0PNeKrmjg5w6dr6ngPVUPox7y8ejQl2ts90",
            requestTokenURL: "http://api.photobucket.com/album/" + username + "?format=json" 
        };

        this.par = {};
        this.par = {
            oauth_signature: "",
            oauth_nonce: "",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.access.consumerKey,
            oauth_token: this.accessor.oauthToken,
            oauth_timestamp: "",
            oauth_version: "1.0" //,
            //status: "TestStatus"
        };
        this.message = {action: this.access.requestTokenURL, method: "GET", parameters: [] };
        this.message.parameters = this.par;

        this.message = this.$.OAuth1.setTimestampAndNonce(this.message);
        this.message = this.$.OAuth1.sign(this.message, this.accessor);
        this.message.action = this.$.OAuth1.addToURL(this.message.action, this.message.parameters);
       
        console.log(this.message.action);
        this.$.webService1.setUrl(this.message.action);
        this.$.webService1.setMethod(this.message.method);
        this.$.webService1.setHeaders({Authorization: "OAuth"});
        this.$.webService1.call({},{onSuccess: "webService3PostSuccess"});
    },

    getGeodata: function(inUrl){
        this.access = {};
        this.access = {
            consumerKey: "149831754", //"Yj3jl7d1C8SFXvqUkscDQ",
            consumerSecret: "ed94895c3d62bd0620cc37ff4ead5d34", //"lBnxd1Z0PNeKrmjg5w6dr6ngPVUPox7y8ejQl2ts90",
            requestTokenURL: "http://api.photobucket.com/media/" + encodeURIComponent(inUrl) +"/geo?format=json",  //"http://api.twitter.com/1/statuses/update.json"
        };

        var cookieContents = enyo.getCookie("AuthTokens");
        this.accessor = enyo.json.parse(cookieContents);

        this.par = {};
        this.par = {
            oauth_signature: "",
            oauth_nonce: "",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.access.consumerKey,
            oauth_token: this.accessor.oauthToken,
            oauth_timestamp: "",
            oauth_version: "1.0" //,
            //status: "TestStatus"
        };
        this.message = {action: this.access.requestTokenURL, method: "GET", parameters: [] };
        this.message.parameters = this.par;

        this.message = this.$.OAuth1.setTimestampAndNonce(this.message);
        this.message = this.$.OAuth1.sign(this.message, this.accessor);
        this.message.action = this.$.OAuth1.addToURL(this.message.action, this.message.parameters);
       
        console.log(this.message.action);
        this.$.webService1.setUrl(this.message.action);
        this.$.webService1.setMethod(this.message.method);
        this.$.webService1.setHeaders({Authorization: "OAuth"});
        this.$.webService1.call({},{onSuccess: "webService2PostSuccess"});
    },


    getTSdata: function(inUrl){
        this.access = {};
        this.access = {
            consumerKey: "149831754", //"Yj3jl7d1C8SFXvqUkscDQ",
            consumerSecret: "ed94895c3d62bd0620cc37ff4ead5d34", //"lBnxd1Z0PNeKrmjg5w6dr6ngPVUPox7y8ejQl2ts90",
            requestTokenURL: "http://api.photobucket.com/media/" + encodeURIComponent(inUrl) +"/tag?format=json",  //"http://api.twitter.com/1/statuses/update.json"
        };

        var cookieContents = enyo.getCookie("AuthTokens");
        this.accessor = enyo.json.parse(cookieContents);

        this.par = {};
        this.par = {
            oauth_signature: "",
            oauth_nonce: "",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.access.consumerKey,
            oauth_token: this.accessor.oauthToken,
            oauth_timestamp: "",
            oauth_version: "1.0" //,
            //status: "TestStatus"
        };
        this.message = {action: this.access.requestTokenURL, method: "GET", parameters: [] };
        this.message.parameters = this.par;

        this.message = this.$.OAuth1.setTimestampAndNonce(this.message);
        this.message = this.$.OAuth1.sign(this.message, this.accessor);
        this.message.action = this.$.OAuth1.addToURL(this.message.action, this.message.parameters);
       
        console.log(this.message.action);
        this.$.webService1.setUrl(this.message.action);
        this.$.webService1.setMethod(this.message.method);
        this.$.webService1.setHeaders({Authorization: "OAuth"});
        this.$.webService1.call({},{onSuccess: "webService4PostSuccess"});
    },

	setItemHighlighted: function(inHighlight) {
	//	this.$.item.applyStyle("background-color", inHighlight ? "lightblue" : null);
    //    imagethumbnails
    	this.$.item.applyStyle("background-color", inHighlight ? "lightblue" : null);
	},
	avatarTrack: function(inEvent) {
		this.$.avatar.boxToNode({l: inEvent.pageX+20, t: inEvent.pageY - 50});
	},
	itemMousehold: function(inSender, inEvent) {
		this.setItemHighlighted(true);
		// indicate the row that's being dragged
		this.setItemHighlighted(true);
		// show and track a drag avatar
		this.$.avatar.show();
		this.avatarTrack(inEvent);
	},
	itemMouserelease: function() {
		if (!this.dragItem) {
			this.setItemHighlighted(false);
			this.$.avatar.hide();
		}
	},
	// initiate a drag on a list item
	itemDragStart: function(inSender, inEvent) {
		// if this is a horizontal drag
		if (Math.abs(inEvent.dx) > Math.abs(inEvent.dy)) {
			// indicate we are dragging and store some drag info
			this.dragItem = true;
			inEvent.dragInfo = inEvent.rowIndex;
			// indicate the row that's being dragged
			this.setItemHighlighted(true);
			// show and track a drag avatar
			this.$.avatar.show();
			this.avatarTrack(inEvent);
			return true;
		}
	},
	itemDrag: function(inSender, inEvent) {
		if (this.dragItem) {
			this.avatarTrack(inEvent);
		}
	},
	itemDragFinish: function(inSender, inEvent) {
		if (this.dragItem) {
			// indicate the row is no longer dragging
			this.$.virtualList.prepareRow(inEvent.dragInfo);
			this.setItemHighlighted(false);
			// hide the avatar
			this.$.avatar.hide();
			this.dragItem = false;
		}
	},
	dragOver: function(inSender, inEvent) {
		// if there is drag info, indicate the target is being dragged over
		if (inEvent.dragInfo !== undefined) {
			inSender.applyStyle("background-color", "lightblue");
		}
	},
	dragOut: function(inSender, inEvent) {
		// if there is drag info, indicate the target is no longer being dragged over
		if (inEvent.dragInfo !== undefined) {
			inSender.applyStyle("background-color", null);
		}
	},
	dragDrop: function(inSender, inEvent) {
		// if there is drag info, do a drop
		if (inEvent.dragInfo !== undefined) {
			inSender.applyStyle("background-color", null);
			var row = inEvent.dragInfo;
			// add to the drop list
			this.$.dropList.createComponent({kind: "Item", content: this.data[row]}).render();
			// remove the data from the source list and refresh
			this.data.splice(row, 1);
			this.$.virtualList.refresh();
		}
	},
    
// define your own callback function
    mycallback: function() {
    conosole.log("DDDDDDDD");
// either call the ImageInfo.getAllFields([file]) function which returns an object holding all the info
    console.log("All info about this file: " + ImageInfo.getAllFields(file).toSource());
    // or call ImageInfo.getField([file], [field]) to get a specific field
    console.log("Format: " + ImageInfo.getField(file, "format") + ", dimensions : " + ImageInfo.getField(file, "width") + "x" + ImageInfo.getField(file, "height"));  
    }
    
    
});