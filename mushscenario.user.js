// ==UserScript==
// @name       MushScenario
// @version    1.2.15
// @author     Ma c'hi (mush@machi.tel), 1.2.15+ LAbare
// @description  Modifications de Mush.vg pour parties scénarisées
// @grant      GM_xmlhttpRequest
// @match      http://mush.vg/
// @match      http://mush.vg/*
// @match      http://mush.vg/#
// @exclude    http://mush.vg/g/*
// @exclude    http://mush.vg/gold/*
// @exclude    http://mush.vg/group/*
// @exclude    http://mush.vg/help
// @exclude    http://mush.vg/help*
// @exclude    http://mush.vg/me
// @exclude    http://mush.vg/ranking
// @exclude    http://mush.vg/theEnd/*
// @exclude    http://mush.vg/tid/*
// @exclude    http://mush.vg/u/*
// @copyright  2012-2014+, Ma c'hi
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==
var Main = unsafeWindow.Main;
var localStorage = unsafeWindow.localStorage;

var version = '1.2.14';

/**
 * Userscript global tools
 **/

function m_userscriptInit() {
	if($('#m_userscriptArea').size()<1) {
		localStorage['m_notFirstUserscript'] = false;
		var html = '<div id="m_userscriptArea">'
		+'<h2>UserScripts</h2>'
		+'<div class="m_tabs">'
		+'<ul>'
        +'<li data-id="m_tabs_reduced"><img src="http://mush.vg/img/icons/ui/up.png" alt="reduced" title="Réduire ce cadre" /></li>'
		+'<li data-id="m_tabs_warning"><img src="http://www.hordes.fr/gfx/forum/smiley/h_warning.gif" alt="warning" title="Information sur les userscripts" /></li>'
		+'</ul>'
		+'<div id="m_tabs_warning">'
		+'<p>Vous utilisez actuellement un (ou plusieurs) UserScript(s) : veuillez le(s) désactiver avant tout rapport de bug aux créateurs du jeu.<br /><a href="http://mush.blablatouar.com/help.php" target="_blank">+ d\'infos</a></p>'
		+'</div>'
        +'<div id="m_tabs_reduced"></div>'
		+'</div>'
		+'</div>';
		$('body').append(html);

		var css = ' '
	    +'#m_userscriptArea { position:absolute; top: 45px; background-color: #171C56; border: 1px solid #213578; font-size: 0.7em; padding:4px; width: 300px; right:10px; box-shadow: 0px 0px 5px #000000; overflow:hidden; }'
	    +'#m_userscriptArea p { font-size: inherit; }'
	    +'#m_userscriptArea h2 { font-size: 1em; background: url(http://www.hordes.fr/img/icons/r_repair.gif) 1px 0px no-repeat; margin: 0px 0px 8px 0px; padding-left:20px; }'
	    +'#m_userscriptArea .m_tabs ul { float:right;margin-top: -24px; }'
	    +'#m_userscriptArea .m_tabs ul li { opacity: 0.6; background: #213578; padding:4px 4px 4px 4px; cursor: pointer; display:inline-block; margin: 0px 2px 0px 2px; height:16px; vertical-align:middle;  }'
	    +'#m_userscriptArea .m_tabs ul li.active, #m_userscriptArea .m_tabs ul li:hover { opacity: 1; }'
	    +'#m_userscriptArea .m_tabs { padding: 0px; } '
	    +'#m_userscriptArea .m_tabs div { padding: 4px; background: #213578; display:none; }'
	    +'#m_userscriptArea .m_tabs div h3 { font-size: 1em; border-bottom: 1px dotted #CCCCCC; margin-bottom: 2px; }'
	    +'#m_userscriptArea .m_tabs div img { margin-bottom:-3px; }'
	    +''
	    +'#m_tabs_reduced { margin-bottom:-15px; visibility:hidden; }'
	    +''
	    +'#m_userscriptPopin { z-index:1000; position:absolute; top: 140px; background-color: #171C56; border: 1px solid #213578; font-size: 1em; padding:4px; width: 800px; right:0px; left:0px; margin: auto; box-shadow: 0px 0px 5px #000000; }'
	    +'#m_userscriptPopin h2 { font-size: 0.7em; background: url(http://www.hordes.fr/img/icons/r_repair.gif) 1px 0px no-repeat; margin: 0px 0px 3px 0px; padding-left:20px; }'
	    +'#m_userscriptPopin em { color:#84E100; }'
	    +'#m_userscriptPopin #m_userscriptPopinContent { padding: 4px; background: #213578; }'
	    +'#m_userscriptPopin #m_userscriptPopinContent h4 { margin:4px; }'
	    +'#m_userscriptPopin #m_userscriptPopinContent p { margin: 4px 4px 4px 8px; font-size:0.9em;  }'
	    +'#m_userscriptPopin #m_userscriptPopinContent a.m_userscriptPopinClose { display:block; width: 100px; margin: 15px auto 5px; background-color: #102B83; border: 1px solid #171C56; color: #CCCCCC; text-decoration: none; text-align:center;  box-shadow: 0px 0px 5px #000000; }'
	    +'#m_userscriptPopin #m_userscriptPopinContent a.m_userscriptPopinClose:hover { color: #FFFFFF; box-shadow: 0px 0px 3px #000000; }'
		+'@media all and (max-width: 1700px) {'
		+' ul.kmenu { margin-right:310px; }'
		+' ul.kmenu li.kmenuel a { width: 100px; }'
		+'}'
	    +'*[data-m="compatibilityData"] { display:none !important; }'
	    +' ';
	    $('head').append('<style type="text/css">'+css+'</style>');
	    
	    $('#m_userscriptArea .m_tabs ul li').click(function() {
	        $('#m_userscriptArea .m_tabs div').slideUp();
	        $('#'+$(this).attr('data-id')).slideDown();
	        $('#m_userscriptArea .m_tabs ul li').removeClass('active');
	        $(this).addClass('active');
	        localStorage['m_currentTab']=$(this).attr('data-id').substr(7);
	    });
	} else {
		localStorage['m_notFirstUserscript'] = true;
	}
}

function m_userscriptAfterInit() {
    if(localStorage['m_currentTab']) {
    	if(!localStorage['m_notFirstUserscript']) {
        	$('#m_userscriptArea .m_tabs div').slideUp();
    	}
        $('#m_tabs_'+localStorage['m_currentTab']).slideDown();
        $('#m_userscriptArea .m_tabs ul li').removeClass('active');
        $('#m_userscriptArea .m_tabs ul li[data-id="m_tabs_'+localStorage['m_currentTab']+'"]').addClass('active');
    } else if(!localStorage['m_notFirstUserscript']) {
        $('#m_userscriptArea .m_tabs div').slideUp();
        $('#m_tabs_warning').slideDown();
        $('#m_userscriptArea .m_tabs ul li').removeClass('active');
        $('#m_userscriptArea .m_tabs ul li[data-id="m_tabs_warning"]').addClass('active');
    }
}

function m_updateTab(name,content) {
    $('#m_tabs_'+name).html(content);
}

function m_addTab(name,icon,content,title) {
    if($('#m_tabs_'+name).size()<1) {
       var li = '<li data-id="m_tabs_'+name+'"><img src="'+icon+'" alt="'+name+'" title="'+title+'" /></li>';
       $('#m_userscriptArea .m_tabs ul').append(li);
        var tab = '<div id="m_tabs_'+name+'" style="display:none;"></div>';
       $('#m_userscriptArea .m_tabs').append(tab);
    }
    
    $('#m_userscriptArea .m_tabs ul li[data-id="m_tabs_'+name+'"]').click(function() {
        $('#m_userscriptArea .m_tabs div').slideUp();
        $('#'+$(this).attr('data-id')).slideDown();
        $('#m_userscriptArea .m_tabs ul li').removeClass('active');
        $(this).addClass('active');
        localStorage['m_currentTab']=name;
    });
    
    m_updateTab(name,content);
}

function m_popin(title,message,button) {
    if($('#m_userscriptPopin').size()<1) {
        var html = '<div id="m_userscriptPopin"><h2>UserScripts</h2><div id="m_userscriptPopinContent"></div></div>';
        $('body').append(html);
    }
    
    $('#m_userscriptPopinContent').html('<h4>'+title+'</h4><p>'+message+'</p><a href="#" class="m_userscriptPopinClose">'+button+'</a>');    
    
    $('#m_userscriptPopin').fadeIn();
    $('.m_userscriptPopinClose').click(function(){ $('#m_userscriptPopin').fadeOut(); });
}

/**
 * Userscript specific code
 **/
var sc;

function m_joinScenario() {
    var newScenarioCode = prompt('MushScénario\n---------------\nVeuillez saisir le code du scénario à utiliser :');
    if(newScenarioCode==false||newScenarioCode==undefined) return false;
    
    m_loadScenario(newScenarioCode);
}

function m_loadScenario(scenarioCode) {
    var data = 'code='+scenarioCode;
    localStorage['ms_scenarioCode']=scenarioCode;
    setTimeout(function() { GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://mush.blablatouar.com/scenario/api.php?'+data,
        headers:{"Accept": "text/json"},
        onload: function(responseDetails) {
            if(responseDetails.responseText!='null'&&responseDetails.responseText!='') {
                localStorage['ms_scenarioData']=responseDetails.responseText;
                localStorage['ms_scenarioIntro']=true;
        		document.location.reload(true);
            } else {
                alert('MushScénario\n---------------\nScénario introuvable.');
                delete localStorage['ms_scenarioData'];
    			delete localStorage['ms_scenarioCode'];
                document.location.reload(true);
            }
        },
        onabort: function(responseDetails) {
            alert('MushScénario\n---------------\nChargement du scénario annulé.');
            delete localStorage['ms_scenarioData'];
            delete localStorage['ms_scenarioCode'];
            document.location.reload(true);
        },
        onerror: function(responseDetails) {
            alert('MushScénario\n---------------\nErreur lors du chargement du scénario.\n('+responseDetails.statusText+')');
            delete localStorage['ms_scenarioData'];
            delete localStorage['ms_scenarioCode'];
            document.location.reload(true);
        }
    }); },0);
}

function m_leaveScenario() {
    delete localStorage['ms_scenarioCode'];
    delete localStorage['ms_scenarioData'];
    $('#m_scenario_details').html('<em>Veuillez actualiser la page ...</em>');
    document.location.reload(true);
}

function m_parseThis() {
    var log = '';
    if(!$(this).hasClass('ms_parsed')&&$(this).attr('data-m')!="compatibilityData") {
        $(this).addClass('ms_parsed');
        var original = sc['original_names'];
        
        for(cat in original) {
            for(id in original[cat]) {
                var name = original[cat][id];
                var search = name;
                if($(this).text().indexOf(search)>=0&&sc[cat+'_'+id]!='') {
                    log+='found '+search+' ('+cat+'_'+id+' => "'+sc[cat+'_'+id]+'") '
                    $(this).html($(this).html().replace(new RegExp(search+'(?!(\.png|[a-zA-Zàâçèéêîôùû]))','gi'),'<span class="ms_replaced" title="'+name+'">'+sc[cat+'_'+id]+'</span>'));
                }
            }
        }
    }
    if(log!='') console.log('[M_parseThis] '+log);
}

function m_parseHTML(html) {    
    var log = '';
    var original = sc['original_names'];
    var result_html = html;
    for(cat in original) {
        for(id in original[cat]) {
            var name = original[cat][id];
            var search = name;
            if(html.toLowerCase().indexOf(search.toLowerCase())>=0&&sc[cat+'_'+id]!='') {
                log+='found '+search+' ('+cat+'_'+id+' => "'+sc[cat+'_'+id]+'") '
                var replacement = sc[cat+'_'+id];
                var result_html = result_html.replace(new RegExp(search+'(?!(\.png|[a-zA-Zàâçèéêîôùû]))','gi'),replacement);
            }
        }
    }

    if(log!='') console.log('[M_parseHTML] '+log);
    if(result_html) return result_html;
    return html;
}





function m_replaceNames() {
    $('#chat_col span.buddy').each(m_parseThis);
    $('#chat_col strong').each(m_parseThis);
    $('#chat_col .objective p').each(m_parseThis);
    $('h1.who').each(m_parseThis);
    $('#vending ul.dev li h3').each(m_parseThis);
	if ($('#MS_refreshblock').size() < 1) {
		$('<div>').attr('id', 'MS_refreshblock').appendTo($('#localChannel')).hide();
	}
}

function m_applyScenario() {
    if(localStorage['ms_scenarioData']==''||localStorage['ms_scenarioData']==undefined) {
        if(localStorage['ms_scenarioCode']!=''||locaStorage['ms_scenarioCode']==undefined) {
            m_leaveScenario();
        } else {
            m_loadScenario(localStorage['ms_scenarioCode']);
        }
    }
    
    sc = $.parseJSON(localStorage['ms_scenarioData']);
    if(!sc) {
        console.log(sc);
        alert('MushScénario\n---------------\nUne erreur s\'est produite lors du chargement du scénario...');
        m_leaveScenario();
        return false;
    }
    if(!sc['original_names']||!sc['id']) {
        // Reload if old scenario format loaded.
        m_loadScenario(localStorage['ms_scenarioCode']);
    }
    
    $('#m_scenario_title').html(sc.title);
    $('.introScenario').click(function() { m_popin(sc.title,'<em>'+sc.intro.replace(/(\n)/g,'<br />')+'</em>','Fermer'); });
    if(sc.rules.length>0) {
    	$('.rulesScenario').click(function() { m_popin('Règles de la partie',sc.rules.replace(/(\n)/g,'<br />'),'Fermer'); });
    } else {
    	$('.rulesScenario').click(function() { m_popin('Règles de la partie','Pas de règle spécifique au scénario.<br />Pensez tout de même à respecter le <a href="http://mush.vg/help?cat=general&scat=rule" target="_blank">règlement</a> ainsi que les <a href="http://twinoid.com/support/cgu" target="_blank">C.G.U.</a> du jeu !','Fermer'); });
    }
    
    // Display Intro
    if(localStorage['ms_scenarioIntro']!=undefined) {
        m_popin(sc.title,'<em>'+sc.intro.replace(/(\n)/g,'<br />')+'</em>','Fermer');
        delete localStorage['ms_scenarioIntro'];
    }
    
    // Who is playing ?
    localStorage['ms_who'] = $('h1.who').text();
    	// astropad compatibility
   		$('h1.who').before('<h1 class="h1 who" data-m="compatibilityData">'+localStorage['ms_who']+'</h1>');
    
    // Replace names
    m_replaceNames(sc);
    
    // Handle ajax updates
    /*var ms_mainUpdateContent = Main.updateContent;
    Main.updateContent = function(url,seek,dest,cb) {
        ms_mainUpdateContent(url,seek,dest,cb);
        setTimeout(m_replaceNames,3000);
    }
    
    var ms_mainLoadMoreWall = Main.loadMoreWall;
    Main.loadMoreWall = function(jq) {
        ms_mainLoadMoreWall(jq);
        setTimeout(m_replaceNames,2000);
    }*/
	now = $("#input").attr('now');
	setInterval(function() {
		if ($('#MS_refreshblock').size() < 1) {
			m_replaceNames();
		}
	}, 1000);
    
    // Handle tooltip content
    var ms_mtJsTipShow = mt.js.Tip.show;
    mt.js.Tip.show = function(refObj,contentHTML,cName,pRef) {
        var parsed_html = m_parseHTML(contentHTML);
        ms_mtJsTipShow(refObj,parsed_html,cName,pRef);
    }
}

function m_thisInit() {
    var html = ''
    +'<p style="float:right;opacity:0.4;"><a href="http://mush.blablatouar.com/scenario/index.php" target="_blank">v '+version+'</a></p>'
    +'<h3><img src="http://mush.blablatouar.com/img/scenario.png" /> MushScénario</h3>'
    +'<span id="m_scenario_details"></span>'
    +'';
    m_addTab('scenario','http://mush.blablatouar.com/img/scenario.png',html,'Mush Scénario');
        
    var ms_code = localStorage['ms_scenarioCode']; 
    if(ms_code!=''&&ms_code!=undefined) {
        $('#m_scenario_details').html('<strong>Scénario en cours :</strong><br />'
                                      +'<span id="m_scenario_title"><em>Chargement...</em></span>'
                                      +'<span><img src="http://www.hordes.fr/gfx/forum/smiley/h_warning.gif" /> <a href="#" class="rulesScenario">Règles</a></span>'
                                      +'<span><img src="http://data.hordes.fr/gfx/icons/item_rp_twin.gif" /> <a href="#" class="introScenario">Introduction</a></span>'
                                      +'<br /><strong style="display: inline-block;margin-top: 3px;">Actions Scénario : </strong><br />'
                                      +'<span><img src="http://data.twinoid.com/img/icons/refresh.png" /> <a href="#" class="refreshScenario">Recharger</a></span>'
                                      +'<span><img src="http://mush.vg/img/icons/ui/unsociable.png" /> <a href="#" class="leaveScenario">Quitter</a></span>'
                                      +'<span><img src="http://www.hordes.fr/gfx/forum/smiley/h_plan.gif" /> <a href="http://mush.blablatouar.com/scenario/create.php" target="_blank">Nouveau</a></span>');
    	m_applyScenario();
    } else {
        $('#m_scenario_details').html('Aucun scénario en cours<br />'
                                      +'<span class="solo"><img src="http://www.hordes.fr/gfx/forum/smiley/h_hunter.gif" /> <a href="#" class="joinScenario">Rejoindre un scénario</a></span>'
                                      +'<span class="solo"><img src="http://www.hordes.fr/gfx/forum/smiley/h_plan.gif" /> <a href="http://mush.blablatouar.com/scenario/create.php" target="_blank">Créer un scénario</a></span>');
    }
    $('.joinScenario').click(function(){ m_joinScenario(); });
    $('.refreshScenario').click(function(){ m_loadScenario(ms_code); });
    $('.leaveScenario').click(function(){ if(confirm('MushScénario\n-------------------------\nVous allez quitter ce scénario. En êtes-vous sûr ?')) m_leaveScenario(); });

    var css = '#m_scenario_details span#m_scenario_title { display:block; width:100%; padding-left:10px; }'
    + '#m_scenario_details span { display: inline-block; width: 96px; text-align:left; }'
    + '#m_scenario_details span.solo { width: 100%; }'
    + '.ms_replaced { cursor: help; }';
    $('head').append('<style type="text/css">'+css+'</style>');
}


/**
 * Userscript init
 **/
function m_init() {
    m_userscriptInit();
    m_thisInit();
    m_userscriptAfterInit();
}
window.addEventListener('load', m_init, false);
