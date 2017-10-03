var nextlevel='';
var parentID='';
var currentID='';
var nextPATH='';
var currentPATH='';
var new_path='';
var this_company='';
var source_data=null;

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery"], factory );
	} else if (typeof module === "object" && module.exports) {
		module.exports = factory( require( "jquery" ) );
	} else {
		factory( jQuery );
	}
}(function( $ ) {
	
	$.extend( $.fn, {
		remove_option: function(company){
			var all_users=$(".user");
			all_users.each(function(){
				$('#dialog_user_'+company+' select').find('option[value='+$(this).attr('id')+']').remove();		
			});
		},
		add_option: function(user,role,name,company){
			var find_user=$('#dialog_user_'+company+' select').find('option[value='+user+']');
			if(find_user.length==0){
				$('#dialog_user_'+company+' select').append('<option value="'+user+'" role="'+role+'">'+name+'</option>');	
			}	
		},
		insertNode: function(companylevel,parentID,myPATH,myID,myNAME,myROLE){
			var current_org_index=companylevel.split("_")[0];
			var level=companylevel.split("_")[1];
			var next_level=parseInt(level)+1;			
			var new_path_arr=myPATH.split('.');
			var myparrentID=new_path_arr[new_path_arr.length-2];
			var myparrentID_position=$("div[id="+myparrentID+"]").position();
			var newuserID=myID;
			if(next_level==3){
				var adduser='<div id="'+newuserID+'" class="user" path="'+myPATH+'" myname="'+myNAME+'" title="'+newuserID+'-'+myNAME+'">'
				+'<img class="user_pic" src="/images/user01.png" width="16"/>'+current_org_index
				+'<p>'+myNAME.substr(0,6)+'</p>'
				+'<span id="deluser" class="del actimgleft"><img src="/images/del02.png" width="20"/></span>'
				+'<span id="'+newuserID+'" class="add actimgright"><img src="/images/add.png" width="20"/></span></div>';
				$("#peoplelist tr[id="+current_org_index+"] td[id="+current_org_index+"_"+next_level+"]").append(adduser);				
				$("#peoplelist tr[id="+current_org_index+"] td[id="+current_org_index+"_"+(next_level+1)+"]").append('<div class="user_group" id="peoplelist_'+current_org_index+'_'+(next_level+1)+'_'+newuserID+'"></div>');
			}else if(next_level==4){
				var adduser='<div id="'+newuserID+'" class="user" path="'+myPATH+'" myname="'+myNAME+'" title="'+newuserID+'-'+myNAME+'">'
				+'<img class="user_pic" src="/images/user01.png" width="12"/>'+myNAME.substr(0,5)
				+'<span id="deluser" class="del subactimgright"><img src="/images/del02.png"/></span>'
				+'</div>';								
				var this_group=$("div[id=peoplelist_"+current_org_index+"_"+next_level+"_"+myparrentID+"]");				
				if($(this_group).find("#"+newuserID).length==0){
					$("div[id=peoplelist_"+current_org_index+"_"+next_level+"_"+myparrentID+"]").append(adduser);	
				}		
			}					
			if($("div[id=peoplelist_"+current_org_index+"_"+next_level+"] div").length>0){
				var s_index=current_org_index.toUpperCase();
				$("div[id=peoplelist_"+current_org_index+"_"+next_level+"] div[id*="+s_index+"]").each(function(){
					var id=$(this).attr('id');			
					$("div.user span[id="+id+"]").on('click',function(){					
						level=current_org_index+"_"+next_level;
						parentID=$(this).parent('div').attr('id');						
						currentID=$(this).attr('id');
						$.fn.selectUser(level,parentID,currentID,myNAME);
						return;			
					});	
				});						
			}else{				
				$("div.user span[id="+newuserID+"]").on('click',function(){	
					
					level=current_org_index+"_"+next_level;
					currentID=$(this).attr('id');						
					var currentPATH_arr=currentPATH.split(".");			
					newuserID=newuserID;			
					$.fn.selectUser(companylevel,newuserID,currentID,myNAME);					
				});
			}				
			return true;
		},
		reline: function(type,company){
			var content_top_height=$(".wrapToper").outerHeight()+$(".wrapTitle").outerHeight();
				//console.info(content_top_height);
			if(type=='del'){
				
			}else if(type=='add'){
				
			}else{				
				if(company=='EL'){
					$.fn.insert_Canvas('EL_2','EL00002');
					$.fn.insert_Canvas('AH_2','AH00001');
				}else{
					$.fn.insert_Canvas('AH_2','AH00001');
				}		
			}
			var change=0;
			if($("td[id=EL_3] div[class=user]").length==1){
				$(".admin").css('margin-top','30px');
				change=30;
			}
			if($("td[id=EL_3] div[class=user]").length==0){
				$(".admin").css('margin-top','30px');
				change=40;
			}
			if(this_company=='EL'){
				var admin=$(".admin")[0];
				
				//change_top_height=$(admin).position().top;
				
				var admin_1=$(".admin")[1];	
				$("canvas[id=Canvas_1]").remove();
				$("#peoplelist tr[id=EL] td[id=canvas_1]").append('<canvas id="Canvas_1" width=20 height='+$("#peoplelist").height()+'/>');
				var canvas_1 = document.getElementById('Canvas_1');
				var context_1 = canvas_1.getContext('2d');		
				context_1.beginPath();
				context_1.lineWidth = 3;
				context_1.strokeStyle = '#2e6da4';	
				context_1.moveTo(0,$(admin_1).position().top-100+change);
				context_1.lineTo(0,$(admin).position().top-100+change);
				context_1.moveTo(20,$(admin_1).position().top-100+change);
				context_1.lineTo(0,$(admin_1).position().top-100+change);
				context_1.moveTo(20,$(admin).position().top-100+change);
				context_1.lineTo(0,$(admin).position().top-100+change);
				context_1.stroke();
			}
			var canvas_group=$("#canvas_group_left_"+company+"_2").children();			
			$(canvas_group).each(function(index){				
				var current_id=$(this).attr('id').split("_")[3];
				$("div[id=canvas_group_left_"+current_id+"]").remove();				
				$("#canvas_group_left_"+company+"_2").append('<div id="canvas_group_left_'+current_id+'" style="height:100px;margin-top:0px;"></div>');
				$("#canvas_group_left_"+current_id).append('<canvas id="Canvas_group_left_'+current_id+'" height=100 width=40></canvas>');				
				var canvas1 = document.getElementById('Canvas_group_left_'+current_id);	
				var context = canvas1.getContext('2d');
				context.beginPath();
				context.strokeStyle = '#2e6da4';
				context.lineWidth = 2;				
				context.moveTo(40,65);
				context.lineTo(10,65);
				if(index<canvas_group.length-1){					
					context.moveTo(10,65);
					context.lineTo(10,100);
				}
				if(index>0){
					context.moveTo(10,65);
					context.lineTo(10,0);
				}				
				context.stroke();				
			});
			
		},
		selectUser: function(companylevel,parentID,currentID,currentNAME){
			$(".ui-dialog-content").dialog("close");
			var company=companylevel.split('_')[0];
			$.fn.remove_option(company);
			nextlevel=companylevel.split('_')[1];	
			new_path=$("div[id="+currentID+"]").attr('path');
			parentID=parentID;			
			var this_path_arr=new_path.split(".");
			var this_currentID=this_path_arr[this_path_arr.length-1];			
			$("#dialog_user_"+company+" p[id=parrent_user]").html('選擇'+currentNAME+'的成員');					
			$("#dialog_user_"+company ).dialog({
				title:'選擇成員',
				height:650,
				closeText : ''
			});
		},
		selectUserInsert: function(addusers,company,currentPATH){
			parentID=parentID;
			var level=currentPATH.split(".").length-1;		
			var all_users=$(".user");		
			for(var i=0 in addusers){				
				var myNAME=$("select option[value="+addusers[i]+"]").text();
				var myROLE=$("select option[value="+addusers[i]+"]").attr('role');
				var myID=addusers[i];
				myPATH=new_path+"."+myID;
				var this_continue=0;
				all_users.each(function(){				
					if($(this).attr('path').indexOf(myID)>-1){
						this_continue++;
					}
				});
				if(this_continue>0){ continue;}				
				var check_insert=$.fn.insertNode(company+'_'+(parseInt(level)+1),parentID,myPATH,myID,myNAME,myROLE);
				if(check_insert===true){					
					$.fn.insert_Canvas(company+'_'+(parseInt(level)+2),myID);			
				}
			}
			$(".user span").hide();		
			var count=0;
			$.fn.reline('add',company);	
			$.fn.reflash_draggable();
			$.fn.reflash_del_bind();
			$.fn.showhidebutton();
			$( "#dialog_user_"+company ).dialog('close');
		},
		insert_Canvas: function(companylevel,current_id){
			var company=companylevel.split("_")[0];
			var level=companylevel.split("_")[1];
			var level=parseInt(level);	
			if(level!=3){return;}			
			var next_canvas=$("#peoplelist tr td[id=canvas_"+company+"_"+level+"]");			
			if(next_canvas.length==1){				
				var canvas_group=$("div[id=canvas_group_"+company+"_"+level+"]");
				if(canvas_group.length==1){				
					var canvasdiv=$("div[id=canvas_group_"+current_id+"]");
					if(canvasdiv.length==1){
						var canvas=$("canvas[id=Canvas_group_"+current_id+"]");
						if($(canvas).length==0){
							$(canvasdiv).append('<canvas id="Canvas_group_'+current_id+'" height=100 width=40></canvas>');
						}					
					}else{
						$(canvas_group).append('<div id="canvas_group_'+current_id+'" style="height:100px;margin-bottom:0px;"></div>');
						var canvasdiv=$("div[id=canvas_group_"+current_id+"]");
						$(canvasdiv).append('<canvas id="Canvas_group_'+current_id+'" height=100 width=40></canvas>');
					}			
				}else{	
						
					$(next_canvas).append('<div id="canvas_group_'+company+'_'+level+'" style="margin-top:0px;"></div>');
					var canvas_group=$("div[id=canvas_group_"+company+"_"+level+"]");
					$(canvas_group).append('<div id="canvas_group_'+current_id+'" style="height:100px;margin-bottom:0px;"></div>');
					var canvasdiv=$("div[id=canvas_group_"+current_id+"]");
					$(canvasdiv).append('<canvas id="Canvas_group_'+current_id+'" height=100 width=40></canvas>');			
				}				
			}else{						
				var next_canvas=$("#peoplelist tr td[id=canvas_"+company+"_"+level+"]");		
				$(next_canvas).append('<div id="canvas_group_'+company+'_'+level+'" style="height:px;margin-top:0px;"></div>');
				var canvas_group=$("div[id=canvas_group_"+company+"_"+level+"]");
				$(canvas_group).append('<div id="canvas_group_'+current_id+'" style="margin-bottom:0px;"></div>');
				var canvasdiv=$("div[id=canvas_group_"+current_id+"]");
				$(canvasdiv).append('<canvas id="Canvas_group_'+current_id+'" height=100 width=30></canvas>');				
			}			
			var canvas1 = document.getElementById('Canvas_group_'+current_id);	
			var context = canvas1.getContext('2d');
			context.beginPath();
			context.strokeStyle = '#2e6da4';
			context.lineWidth = 2;
			if(level==2){
				context.moveTo(40,50);
				context.lineTo(0,50);
			}else{
				context.moveTo(40,65);
				context.lineTo(0,65);
			}	
			context.stroke();				
			var pre_canvas=$("#peoplelist tr td[id=canvas_"+company+"_"+(level-1)+"]");	
			if(pre_canvas.length==1){				
				var pre_canvas_group=$("div[id=canvas_group_left_"+company+"_"+(level-1)+"]");
				if(pre_canvas_group.length==1){				
					var pre_canvasdiv=$("div[id=canvas_group_left_"+current_id+"]");
					if(pre_canvasdiv.length==1){
						var pre_canvas=$("canvas[id=Canvas_group_left_"+current_id+"]");
						if($(pre_canvas).length==0){
							$(pre_canvasdiv).append('<canvas id="Canvas_group_left_'+current_id+'" height=100 width=40></canvas>');
						}					
					}else{
						$(pre_canvas_group).append('<div id="canvas_group_left_'+current_id+'" style="height:100px;margin-bottom:0px;"></div>');
						var pre_canvasdiv=$("div[id=canvas_group_left_"+current_id+"]");
						$(pre_canvasdiv).append('<canvas id="Canvas_group_left_'+current_id+'" height=100 width=40></canvas>');
					}			
				}else{	
						
					$(pre_canvas).append('<div id="canvas_group_left_'+company+'_'+(level-1)+'" style="margin-top:0px;"></div>');
					var pre_canvas_group=$("div[id=canvas_group_left_"+company+"_"+(level-1)+"]");
					$(pre_canvas_group).append('<div id="canvas_group_left_'+current_id+'" style="height:100px;margin-bottom:0px;"></div>');
					var pre_canvasdiv=$("div[id=canvas_group_left_"+current_id+"]");
					$(pre_canvasdiv).append('<canvas id="Canvas_group_left_'+current_id+'" height=100 width=40></canvas>');			
				}				
			}else{						
				var pre_canvas=$("#peoplelist tr td[id=canvas_"+company+"_"+(level-1)+"]");		
				$(pre_canvas).append('<div id="canvas_group_left_'+company+'_'+(level-1)+'" style="height:px;margin-top:0px;"></div>');
				var pre_canvas_group=$("div[id=canvas_group_left_"+company+"_"+(level-1)+"]");
				$(pre_canvas_group).append('<div id="canvas_group_left_'+current_id+'" style="margin-bottom:0px;"></div>');
				var canvasdiv=$("div[id=canvas_group_left_"+current_id+"]");
				$(pre_canvasdiv).append('<canvas id="Canvas_group_left_'+current_id+'" height=100 width=30></canvas>');				
			}
		},
		reflash_draggable:function(){
			$(".user_group .user").draggable({
				cursor: 'move',
				stop:function(){
					var Stoppos = $(this).position();					
					var new_el=null;
					var count=0;
					$(".user_group").each(function(){						
						if(Stoppos.top < $(this).position().top){
							new_el=$(".user_group")[count-1];
							return false;
						}
						count++;
					});					
					if(count==0){
						var append_id=$(this).parent('div').attr("id");
					}else if(count==$(".user_group").length){						
						var append_id=$($(".user_group")[$(".user_group").length-1]).attr("id");
					}else{
						var append_id=$(new_el).attr("id");				
					}
					var from_company=$(this).parent('div').parent('td').parent('tr').attr('id');
					var to_company=$("#"+append_id).parent('td').parent('tr').attr('id');					
					if(from_company!=to_company){
						append_id=$(this).parent('div').attr("id");
					}					
					var this_parent_id=$(this).parent("div").attr("id").split("_")[3];
					var new_parent_id=append_id.split("_")[3];
					var new_path=$(this).attr('path').replace(this_parent_id,new_parent_id);
					$(this).appendTo($("#"+append_id));				
					$(this).attr('path',new_path);					
					$(this).css('left','');
					$(this).css('top','');						
				}
			});
		},
		reflash_del_bind: function(){
			$("div span[id=deluser]").unbind();
			$("div span[id=deluser]").bind('click',function(e){		
				var td_id=$(this).parent('div').parent('td').attr('id');
				var this_id=$(this).parent('div').attr('id');
				var this_name=$(this).parent('div').attr('myname');				
				if(td_id){
					var company=$(this).parent('div').parent('td').parent('tr').attr('id');
				}else{	//del sub user
					var company=$(this).parent('div').parent('div').parent('td').parent('tr').attr('id');
					e.preventDefault();				
					$('#confirmModal div[class=deluser]').remove();
					$('#confirmModal').append('<div id="'+this_id+'" group="'+group_id+'" class="deluser"></div>');
					$('#confirmModal').modal();
					$('#confirmModal').one('click', '#delete',function () {
						var this_del_user=$('#confirmModal div[class="deluser"]').attr('id');
						$.fn.add_option(this_del_user,'user',this_name,company);
						$("div[id="+this_del_user+"]").remove();
					});					
					return false;		
				}				
				var group_id='peoplelist_'+td_id.split("_")[0]+'_'+(parseInt(td_id.split("_")[1])+1)+'_'+this_id;				
				var this_path=$(this).parent('div').attr('path');				
				var next_child_group=$("div[id="+group_id+"] div");				
				if(next_child_group.length>0){
					//此USER還有組員存在無法刪除
					$("#alert_msg").html('此USER帳號還有組員存在無法刪除');
					$("#AlertModal").modal('show');
					return false;					
				}
				//e.preventDefault();
				e.stopPropagation();				
				$('#confirmModal div[class=deluser]').remove();
				$('#confirmModal').append('<div id="'+this_id+'" group="'+group_id+'" class="deluser"></div>');
				$('#confirmModal').modal();
				$('#confirmModal').one('click', '#delete',function () {
					var this_del_user=$('#confirmModal div[class="deluser"]').attr('id');
					var this_del_group=$('#confirmModal div[class="deluser"]').attr('group');
					$.fn.removeitem(this_del_user,this_del_group,this_name,company);
				});	
			});
		},
		loaddata: function(data){
			for(var i=0 in data){
				//console.info(data[i].path);
				parentID=data[i].path.split(".")[data[i].path.split(".").length-2];		
				var level=data[i].path.split(".").length;
				var canvas_td=$("#peoplelist tr td[id=canvas_"+(level-1)+"]");			
				var nextlevel=level;
				var myPATH=data[i].path;
				var myID=data[i].path.split(".")[data[i].path.split(".").length-1];
				var myNAME=data[i].name;
				var myROLE=data[i].role;
				var myCOMPANY=data[i].company;
				$.fn.insertNode(myCOMPANY+"_"+(level-1),parentID,myPATH,myID,myNAME,myROLE);
				if(level==3){
					$.fn.insert_Canvas(myCOMPANY+"_"+level,myID);	
				}				
				$.fn.remove_option(myCOMPANY);
			}
			$.fn.reflash_draggable();
			$.fn.reflash_del_bind();
			$.fn.showhidebutton();						
		},
		showhidebutton: function(){
			$(".user span").hide();
			$(".user").on('mouseover',function(){
				$("#"+$(this).attr("id")+" span").show();
			});
			$(".user").on('mouseout',function(){
				$("#"+$(this).attr("id")+" span").hide();
			});
		},
		removeitem:function(this_id,group_id,this_name,company){
						
			$("div[id="+this_id+"]").remove();	
			$("div[id=canvas_group_"+this_id+"]").remove();
			$("div[id=canvas_group_left_"+this_id+"]").remove();
			$("div[id="+group_id+"]").remove();				
			$.fn.add_option(this_id,'user',this_name,company);					
			$.fn.reline('del',company);
												
			return false;
		}		
	});
}));