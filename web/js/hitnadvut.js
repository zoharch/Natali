var name , phone , address , selection
            var urlStr;
            var jsonObj = {};
            var onSuccess;
            
			$(document).ready(function(){
                $("#main_volunteer").hide();
                $("#final").hide();
                $("#progress").hide();
                $("#mail").hide();
				$("#loginBtn1").click(function(){
					name = $("#name").val();
					phone = $("#phone").val();
					address = $("#address").val();
                    selection = $("#select_role").val();
					if(name.length == 0 || phone.length == 0 || selection == "temp1" || address.length == 0){
						$("#myModal").modal();
						return;
					} else {
                        register();
                    }
                   
				});
                $("#loginBtn2").click(function(){
                    var phone = $("#select_hanicap option:selected").val();
					var shelter = $("#select_shelter option:selected").val();
                    if(phone == 'empty' || shelter == "empty"){
						$("#myModal").modal();
						return;
					} else {
                         $("#main_volunteer").hide();
                         var name = $("#select_hanicap option:selected").text();
                         mail(phone,name);
                    }
                    
                });
			});
            
            function mail(phone,name) {
                data = {};
                data.phone = phone;
                data.name = name;
                var template = '<a class="greenButtonRound glyphicon glyphicon-envelope " href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to={{phone}}@cellcom.co.il" target="_blank"> לשליחת הודעת סמס ל- {{name}}   </a>'
                var html = Mustache.to_html(template, data);
                $('#mail').html(html);
                $('#mail').show();
                $('#mail').click(function(){
                    window.location.reload();
                });
            }

            
			function register() {
                $("#registration").hide();
                $("#progress").show();
        
                jsonObj.name = name;
                jsonObj.address = address;
                jsonObj.phoneNumber = phone;
                jsonObj.volunteer = parseInt(selection)
                
                urlStr = urlRegister;
                
                onSuccess = function(data) {
                               $("#progress").hide();
                               if (jsonObj.volunteer == 1) {
                                    buildVolunteerScreen(data);    
                               } else {
                                    $("#final").show();  
                               }
                }
              	 $.ajax({
                           url: urlStr,
                           data: jsonObj,
                           error: function() {
                              $('#info').html('<p>An error has occurred</p>');
                           },
                           dataType: 'json',
                           success: function(data) {onSuccess(data)},
                           type: 'GET'
                        });
                
            }
            
            
			function buildVolunteerScreen(data) {
                    $("#progress").show();
                    //request handicap users:
                    handicapList();
                    sheltersList();
            };
            
            function handicapList() {
                jsonObj = {};
                jsonObj.action = 0;
                jsonObj.volunteer = 0;

                urlStr = urlHandicapUsers;    

                //request handicap list
                $.ajax({
                           url: urlStr,
                           data: jsonObj,
                           error: function() {
                              $('#info').html('<p>An error has occurred</p>');
                           },
                           dataType: 'json',
                           success: function(data) {  //build handicap list
                           //mustach:
                           //todo: remove this later
//                           data = {};
//                           data.data = [
//                               {name: "זוהר", phone: "0522499060"},
//                               {name: "שראל", phone: "0523477774"},
//                               {name: "בר", phone: "0523084442"},
//                               {name: "moshe", phone: "052222222"},
//                               {name: "דימה", phone: "052111111"},
//                                       ]
                        var template =  "<option  value='empty'> בחירת נכה </option>" +
                                        "{{#users}}  " +
                                        " <option value='{{phone}}'> {{name} - {{phone}}-{{address}} </option>  " +
                                        " {{/users}} " ;

//                            var template =  "{{#users}}  " +
//                                            " <option >  {{name}}  {{phoneNumber}}  {{address}} </option>  " +
//                                            " {{/users}} " ;
//                               
                        var html = Mustache.to_html(template, data);
                        $('#select_hanicap').html(html);
                        $("#progress").hide();
                        $("#main_volunteer").show();
                        console.log("volunteer: " + data);
                       },
                           type: 'GET'
                        });
            }
            
            function sheltersList() {
                jsonObj = {};
                jsonObj.action = 1;

                urlStr = urlShalters;    

                //build shelter list
                onSuccess = function(data) {
                           $("#progress").hide();
                               //mustach:
                            var template =  " <option  value='empty'> בחירת מקלט </option> " +
                                            "{{#shelters}}  " +
                                            " <option > {{name} - {{phone}}-{{address}}</option>  " +
                                            " {{/shelters}} " ;
                               
//                            var template =  "{{#shelters}}  " +
//                                            " <option >  {{name}}  {{phoneNumber}}  {{address}} </option>  " +
//                                            " {{/shelters}} " ;
//                              
                               var html = Mustache.to_html(template, data);
                            $('#select_shelter').html(html);
                            $("#main_volunteer").show();
                       };

                //request shelters List 
                 $.ajax({
                           url: urlStr,
                           data: jsonObj,
                           error: function() {
                              $('#info').html('<p>An error has occurred</p>');
                           },
                           dataType: 'json',
                           success: function(data) {onSuccess(data)},
                           type: 'GET'
                        });
            }