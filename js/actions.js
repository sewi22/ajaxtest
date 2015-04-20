
    var apidomain = "http://winterling.net/phylabapi/v1";
    var username = "swnt24";
    var apikey = "3831621407f42f3290403bff5b57460c";
    var topicid = 86;
    
    $.mobile.document.ready(function() {
    
    });

    document.addEventListener("deviceready", deviceready, false);
    
    function deviceready(){
        navigator.splashscreen.hide();
    }

    

    $.mobile.document.on('pagecreate', '#startPage', function(e){
        e.preventDefault();
        
        var postform = '';
        postform += '<form id="postform">';
        postform += '<textarea name="post" id="post"></textarea>';
        postform += '<input type="submit" id="newpost" value="Absenden"/>';
        postform += '</form>';
                             
        $("#startContent").append(postform);

    });
    
    $.mobile.document.on("click", "#newpost", function(e){
        e.preventDefault();
        createNewPost(topicid, $("#post").val(), 1);
    });

    $.mobile.document.on('pagebeforeshow', '#startPage', function(e){
        e.preventDefault();
        getAllPosts(topicid);
    });
    
    
    function createNewPost(topicid, postText, isActive){
        $.mobile.loading("show");
        $.ajax({
            type: "POST",
            beforeSend: function (request){
                request.setRequestHeader("Authorization", apikey);
            },
            url: apidomain+"/posts",
            //data: "topicId=" + topicId + "&postText=" + postText + "&isActive="+ isActive,
            data: {
                topicId: topicid,
                postText: postText,
                isActive: isActive
            },
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            success: function(p){
                sessionStorage.setItem("topicId", topicid);
                $.mobile.loading("hide");
                $("#post").val("");
                //$(':mobile-pagecontainer').pagecontainer('change', '#topicPage');
            },
            error: function(err){
                //okDialog("Es wurde keine Nachricht eingetragen.", function(){});
                $.mobile.loading("hide");
                navigator.notification.alert('Der Beitrag konnte nicht gespeichert werden. '+err.message, null, 'Fehler', 'OK');
            }
        });
    }
    
    function editPost(postId, postText, username, isActive){        
        $.mobile.loading("show");
        $.ajax({
            type: "PUT",
            beforeSend: function (request){
                request.setRequestHeader("Authorization", localStorage.apiKey);
            },
            url: apidomain+"/posts/"+postId,
            //data: "postText=" + postText + "&username=" + username + "&isActive=" + isActive,
            data: {
                postText:postText,
                username:username,
                isActive:isActive  
            },
            contentType: "application/x-www-form-urlencoded",
            dataType:"json",
            success: function(p){
                $.mobile.loading("hide");
                //$(':mobile-pagecontainer').pagecontainer('change', '#topicPage');
            },
            error: function(err){
                //okDialog(err.message, function(){});
                $.mobile.loading("hide");
                navigator.notification.alert(err.message, null, 'Fehler', 'OK');
            }
        });
    }
    
    function deletePost(postId, username){
        confirmDeletePost(1, postId, username);
        //navigator.notification.confirm("Soll dieser Beitrag gelöscht werden?", function(buttonIndex){
            //confirmDeletePost(buttonIndex, postId, username);
        //}, 'Beitrag löschen', ['Ja','Nein']);                                        
    }
    
    //TODO: postId muss von deletePost Function übergeben werden
    function confirmDeletePost(buttonindex, postId, username){                
        if(buttonindex === 1){            
            $.mobile.loading("show");
            $.ajax({
                type: "DELETE",
                beforeSend: function (request){
                    request.setRequestHeader("Authorization", localStorage.apiKey);
                },
                url: apidomain+"/posts/"+postId,
                //data: "username=" + username,
                data: {
                    "username":username
                },
                success: function(p){
                    $.mobile.loading("hide");
                    //$(':mobile-pagecontainer').pagecontainer('change', '#topicPage', {allowSamePageTransition: true});
                },
                error: function(err){
                    //okDialog(err.message, function(){console.log(err)});
                    $.mobile.loading("hide");
                    navigator.notification.alert(err.message, null, 'Fehler', 'OK');
                }
            });
        }    
    }

    
    function getPost(postId, callback){
        $.mobile.loading("show");
        $.ajax({
            type: 'GET',
            url: apidomain+"/posts/"+postId,
            dataType: "json",
            success: function(result) {
                $.mobile.loading("hide");
                callback(result);
            },
            error: function(err){
                //console.log('Fehler beim Laden der Versuchsgruppen: '+err.code);
                //alert('Fehler beim Laden der Versuchsgruppen: '+err.code);
                $.mobile.loading("hide");
                navigator.notification.alert('Fehler beim Laden der Versuchsgruppen: '+err.code, null, 'Fehler', 'OK');
            }
        });
    }
        
    function getAllPosts(topicid){            
        $.mobile.loading("show");
        $.ajax({
            type: 'GET',
            url: apidomain+"/topicposts/"+topicid,
            dataType: "json",
            success: function(result) {
                for(var i=0;i<result.posts.length;i++){
                    (function(i){
                        var post = result.posts[i];                        
                            
                                    var timestamp = convertTimestamp(post.created);
                                    var postContent = "";                                  
                                    if(post.author == username){
                                        postContent += '<div class="post float-left ui-corner-all ui-shadow">';
                                        postContent += '<a href="#" id="deletePostButton" data-postId="'+post.id+'" class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all"></a>';
                                        postContent += '<a href="#" id="editPostButton" data-postId="'+post.id+'" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all"></a>';
                                    } else {
                                        postContent += '<div class="post float-right ui-corner-all ui-shadow">';
                                    }
                                    postContent += '<img src="http://placehold.it/100/ff0" />';
                                    postContent += '<div class=postText>'+post.postText;
                                    postContent += '<p class="postFrom">von '+ post.author+ '<br/>am ' + timestamp +' Uhr</p>';
                                    postContent += '</div>';
                                    postContent += '</div>';
                                    $('#startContent').append(postContent);
                                    $('#startContent').enhanceWithin();                                                            
                                    $.mobile.loading("hide");
                    })(i);
                }
            },
            error: function(err){
                //console.log('Fehler beim Laden der Versuchsgruppen: '+err.code);
                //alert('Fehler beim Laden der Versuchsgruppen: '+err.code);
                $.mobile.loading("hide");
                navigator.notification.alert('Fehler beim Laden der Versuchsgruppen: '+err.code, null, 'Fehler', 'OK');
            }
        });    
    }