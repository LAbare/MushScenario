// ==UserScript==
// @name         MushScenario
// @version      1.3
// @author       Ma c'hi (mush@machi.tel), corrections 1.2.15+ LAbare
// @description  Modifications de Mush.vg pour parties scénarisées
// @grant        GM_xmlhttpRequest
// @match        http://mush.vg/
// @match        http://mush.vg/*
// @match        http://mush.vg/#
// @exclude      http://mush.vg/g/*
// @exclude      http://mush.vg/gold/*
// @exclude      http://mush.vg/group/*
// @exclude      http://mush.vg/help
// @exclude      http://mush.vg/help*
// @exclude      http://mush.vg/me
// @exclude      http://mush.vg/ranking
// @exclude      http://mush.vg/theEnd/*
// @exclude      http://mush.vg/tid/*
// @exclude      http://mush.vg/u/*
// @copyright    2012-2014+, Ma c'hi
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==


try{
var console = unsafeWindow.console;
var Main = unsafeWindow.Main;
var localStorage = unsafeWindow.localStorage;

var scenar_data;


function m_popin(title, message, button) {
	var popup = $('#m_userscriptPopin');
	if (!popup.length) {
		popup = $('<div>').attr('id', 'm_userscriptPopin').css({
			zIndex: 1000, position: 'absolute', top: '40px', right: '0px', left: '0px',
			width: '800px', padding: '4px', margin: 'auto',
			background: '#171C56', border: '1px solid #213578', boxShadow: '0px 0px 5px #000000', fontSize: '1em',
		}).appendTo($('body'));
		$('<h2>').html("<img src='http://mush.blablatouar.com/img/scenario.png' />   MushScénario — " + title).css({
			fontSize: '0.7em', margin: '0 0 3px 0',
		}).appendTo(popup);
		$('<div>').attr('id', 'm_userscriptPopinContent').css({
			padding: '8px 16px', background: '#213578',
		}).appendTo(popup);
	}
	
	var content = $('#m_userscriptPopinContent').empty();
	$('<h4>').html(title).css('margin', '4px').appendTo(content);
	$('<div>').append(message).css({ margin: '4px 4px 4px 8px', fontSize: '0.9em' }).appendTo(content);
	$('<a>').html(button).css({
		display: 'block', width: '100px', margin: '15px auto 5px',
		background: '#102B83', border: '1px solid #171C56', color: '#CCCCCC', boxShadow: '0px 0px 5px #000000',
		textDecoration: 'none', textAlign: 'center',  cursor: 'pointer',
	}).hover(function() {
		$(this).css({ color: '#FFFFFF', boxShadow: '0px 0px 3px #000000' });
	}, function() {
		$(this).css({ color: '#CCCCCC', boxShadow: '0px 0px 5px #000000' });
	}).on('click', function(){
		$('#m_userscriptPopin').fadeOut();
		return false;
	}).appendTo(content);
	
	popup.fadeIn();
}


function m_joinScenario() {
	var newScenarioCode = prompt('MushScénario\n---------------\nVeuillez saisir le code du scénario à utiliser :');
	if (newScenarioCode == false || newScenarioCode == undefined) {
		return false;
	}
	m_loadScenario(newScenarioCode);
}
	
function m_loadScenario(scenarioCode) {
	var data = 'code=' + scenarioCode;
	localStorage['ms_scenarioCode'] = scenarioCode;
	console.log("Récupération du scénario depuis api.php?" + data);
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://mush.blablatouar.com/scenario/api.php?' + data,
		headers: { "Accept": "text/json" },
		onload: function(responseDetails) {
			if (responseDetails.responseText != 'null' && responseDetails.responseText != '') {
				localStorage['ms_scenarioData'] = responseDetails.responseText;
				localStorage['ms_scenarioIntro'] = true;
				console.log("Lancement du scénario " + scenarioCode);
				setTimeout(function() {
					document.location.reload(true);
				}, 2000);
			} else {
				alert('MushScénario\n---------------\nScénario introuvable.');
				delete localStorage['ms_scenarioData'];
				delete localStorage['ms_scenarioCode'];
				console.log("Scénario introuvable");
				setTimeout(function() {
					document.location.reload(true);
				}, 2000);
			}
		},
		onabort: function(responseDetails) {
			alert('MushScénario\n---------------\nChargement du scénario annulé.');
			delete localStorage['ms_scenarioData'];
			delete localStorage['ms_scenarioCode'];
			console.log("Chargement du scénario annulé");
			setTimeout(function() {
				document.location.reload(true);
			}, 2000);
		},
		onerror: function(responseDetails) {
			alert('MushScénario\n---------------\nErreur lors du chargement du scénario.\n(' + responseDetails.statusText + ')');
			delete localStorage['ms_scenarioData'];
			delete localStorage['ms_scenarioCode'];
			console.log("Erreur lors du chargement du scénario.\n(" + responseDetails.statusText + ")");
			setTimeout(function() {
				document.location.reload(true);
			}, 2000);
		}
	});
}

function m_leaveScenario() {
	delete localStorage['ms_scenarioCode'];
	delete localStorage['ms_scenarioData'];
	$('#m_scenario_details').html('<em>Veuillez actualiser la page ...</em>');
	console.log("Suppression du scénario");
	setTimeout(function() {
		document.location.reload(true);
	}, 2000);
}

function m_parseThis() {
	var el = $(this);
	if (!el.hasClass('ms_parsed') && el.attr('data-m') != 'compatibilityData') {
		el.addClass('ms_parsed');
		var original = scenar_data['original_names'];
		var itemdone = false;
		var categories = ['item', 'project', 'search', 'char', 'm']; //À faire dans cet ordre à cause d'Armure et Armure de plastenite
		
		for (var i = 0; i < categories.length; i++) {
			var cat = categories[i];
			for (id in original[cat]) {
				var name = original[cat][id];
				var new_name = scenar_data[cat + '_' + id];
				var name_astro = name.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
				var new_name_astro = new_name.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
				
				//Recherche normale
				if (el.text().indexOf(name) >= 0 && new_name != '') {
					if (cat == 'item' && itemdone) { //"Bloc de Pense-bête" fait "Bloc de Pense-bête" puis "Pense-bête"
						continue;
					}
					console.log('[M_parseThis] found ' + name + ' (' + cat + '_' + id + ' => "' + new_name + '") ');
					el.html(el.html().replace(new RegExp(name + '(?!(\.png|[a-zA-Zàâçèéêîôùû]))', 'gi'), '<span class="ms_replaced" title="' + name + '">' + new_name + '</span>'));
					if (cat == 'item') {
						itemdone = true;
					}
				}
				
				//Recherche sur l'onglet Astropad
				if (el.text().indexOf(name_astro) >= 0 && new_name != '') {
					if (cat == 'item' && itemdone) { //"Bloc de Pense-bête" fait "Bloc de Pense-bête" puis "Pense-bête"
						continue;
					}
					console.log('[M_parseThis] found ' + name_astro + ' in pad (' + cat + '_' + id + ' => "' + new_name + '") ');
					el.html(el.html().replace(new RegExp(name_astro + '(?!(\.png|[a-zA-Zàâçèéêîôùû]))', 'gi'), '<span class="ms_replaced" title="' + name_astro + '">' + new_name_astro + '</span>'));
					if (cat == 'item') {
						itemdone = true;
					}
				}
			}
		}
	}
}

function m_replaceNames() {
	$('#chat_col .buddy, .chat_box .buddy').each(m_parseThis);
	$('#chat_col strong, .chat_box strong').each(m_parseThis);
	$('#chat_col .objective .buddy').each(m_parseThis);
	$('h1.who:not([data-m="compatibilityData"])').each(m_parseThis);
	$('#vending ul.dev li h3').each(m_parseThis);
	if ($('#astrotab').length && localStorage['ms_doAstropad'] == 'true') {
		$('#astro_scrollpanel td').each(m_parseThis);
	}
}


function ms_add_boxlink(parent, text, image, func, href) {
	if (href == undefined) {
		href = '#';
	}
	var span = $('<span>').css('margin-right', '4px').appendTo(parent);
	$('<img>').attr('src', image).css('margin-right', '2px').appendTo(span);
	var link = $('<a>').attr({ href: href, target: '_blank' }).text(text).appendTo(span);
	if (func) {
		link.on('click', func);
	}
}


function ms_display_rules() {
	if (scenar_data.rules.length) {
		m_popin("Règles de la partie", scenar_data.rules.replace(/(\n)/g, '<br />'), "Fermer");
	}
	else {
		m_popin("Règles de la partie", "Pas de règle spécifique au scénario.<br />Pensez tout de même à respecter le <a href='http://mush.vg/help?cat=general&scat=rule' target='_blank'>règlement</a> ainsi que les <a href='http://twinoid.com/support/cgu' target='_blank'>C.G.U.</a> du jeu !", "Fermer");
	}
	return false;
}


function ms_display_intro() {
	m_popin(scenar_data.title, '<em>' + scenar_data.intro.replace(/(\n)/g, '<br />') + '</em>', "Fermer");
	return false;
}


function entities_to_text(text) { //Pour obtenir les bons textes sans entités HTML
	var el = document.createElement('textarea');
	el.innerHTML = text;
	return el.value;
}


function ms_display_table(order_index, current_tab) {
	var box = $('<div>').attr({ 'data-tab': current_tab, 'data-order': order_index });
	var orderswitch = $('<p>').text("Ordre alphabétique : ").css({
		textAlign: 'center',
	}).appendTo(box);
	var tabs = $('<div>').css({ width: '90%', margin: '5px auto' }).appendTo(box);
	var tables = $('<div>').css({ maxHeight: '500px', overflowY: 'auto' }).appendTo(box);
	
	//Ordre alphabétique
	var original = scenar_data['original_names'];
	var ordered = {};
	for (cat in original) {
		ordered[cat] = [];
		for (key in original[cat]) {
			ordered[cat].push([cat + '-' + key, entities_to_text(original[cat][key]), entities_to_text(scenar_data[cat + '_' + key])]);
		}
		ordered[cat].sort(function(a, b) {
			if (a[order_index]) {
				return a[order_index].localeCompare(b[order_index]);
			}
			else {
				if (b[order_index]) {
					return -1;
				}
				else {
					return a[1].localeCompare(b[1]);
				}
			}
		});
	}
	$('<a>').attr('href', '#').text("noms originaux").css({
		fontWeight: (order_index == 1) ? 'bold' : 'normal',
		cursor: 'pointer',
	}).appendTo(orderswitch).on('click', function() {
		ms_display_table(1, box.attr('data-tab'));
		return false;
	});
	orderswitch.append(", ");
	$('<a>').attr('href', '#').text("noms du scénario").css({
		fontWeight: (order_index == 2) ? 'bold' : 'normal',
		cursor: 'pointer',
	}).appendTo(orderswitch).on('click', function() {
		ms_display_table(2, box.attr('data-tab'));
		return false;
	});
	
	//Onglets
	var categories = ['item', 'project', 'search', 'char', 'm'];
	var names = ["Objets", "Projets", "Recherches", "Personnages", "Divers"];
	var icons = [
		'http://mush.vg/img/icons/ui/stock.png',
		'http://mush.vg/img/icons/ui/conceptor.png',
		'http://mush.vg/img/icons/ui/microsc.png',
		'http://mush.vg/img/icons/ui/multi.png',
		'http://mush.vg/img/icons/ui/simulator.png'
	];
	for (var i = 0; i < categories.length; i++) {
		var cat = categories[i];
		var tab = $('<div>').addClass('ms_tab').attr('data-tabname', cat).css({
			display: 'inline-block', width: '20%', boxSizing: 'border-box',
			padding: '4px',
			border: '2px solid #171C56', color: '#EEE',
			background: (cat == current_tab) ? '#45B' : '#34A',
			fontWeight: (cat == current_tab) ? 'bold' : 'normal',
			cursor: 'pointer',
		}).hover(function() {
			$(this).css('background', '#45C');
		}, function() {
			if (!$(this).hasClass('active')) {
				$(this).css('background', '#34A');
			}
		}).appendTo(tabs).on('click', function() {
			$('.ms_table').hide();
			$('.ms_table[data-category="' + $(this).attr('data-tabname') + '"]').show();
			box.attr('data-tab', $(this).attr('data-tabname'));
			$('.ms_tab').removeClass('active').css({ background: '#34A', fontWeight: 'normal' });
			$(this).addClass('active').css({ background: '#45C', fontWeight: 'bold' });
		});
		$('<img>').attr('src', icons[i]).css({
			marginRight: '5px',
		}).appendTo(tab);
		tab.append(names[i]);
		if (cat == current_tab) {
			tab.addClass('active');
		}
		if (i != categories.length - 1) {
			tab.css('border-right', 'none');
		}
	}
	
	//Affichage
	for (var i = 0; i < categories.length; i++) {
		var cat = categories[i];
		var table = $('<table>').addClass('ms_table').attr('data-category', cat).css({
			borderCollapse: 'collapse',
			minWidth: '400px', margin: '10px auto',
		}).appendTo(tables);
		if (cat != current_tab) {
			table.hide();
		}
		table.append("<tr><th style='padding-bottom: 4px;'>Nom original</th><th style='padding-bottom: 4px;'>Nom du scénario</th></tr>");
		for (var j = 0; j < ordered[cat].length; j++) {
			var tr = $('<tr>').appendTo(table);
			var originaltext = ordered[cat][j][1];
			var td = $('<td>').html(originaltext).css({
				width: '50%', padding: '2px',
				border: '1px solid #115', background: '#23A',
			}).appendTo(tr);
			if (cat == 'item') {
				var src = ordered[cat][j][0].split('-')[1].replace(/book_[0-9]/, 'book');
				$('<img>').attr('src', 'http://mush.vg/img/icons/items/' + src + '.jpg').css({
					width: '25px', height: '25px', marginRight: '8px', verticalAlign: 'middle',
				}).prependTo(td);
				td.css('padding', 0);
			}
			else if (cat == 'char') {
				var src = ordered[cat][j][0].split('-')[1].replace('schrodinger', 'cat');
				$('<img>').attr('src', 'http://mush.vg/img/icons/ui/' + src + '.png').css({
					height: '16px', marginRight: '8px', marginLeft: '3px', verticalAlign: 'middle',
				}).prependTo(td);
				td.css('padding', 0);
			}

			var newtext = ordered[cat][j][2];
			if (!newtext) {
				newtext = "<i>Aucun</i>";
			}
			$('<td>').html(newtext).css({
				width: '50%', padding: '2px',
				border: '1px solid #115', background: '#23A',
			}).appendTo(tr);
		}
	}
	m_popin("Tableau des correspondances", box, "Fermer");
	return false;
}


function m_init() {
	//CSS général (compatibilité et infobulles)
	$('<style>').html('[data-m="compatibilityData"] { display:none !important; }').appendTo($('head'));
	$('<style>').html('@media (max-width: 1700px) { ul.kmenu { margin-right: 310px; } ul.kmenu li.kmenuel a { width: 100px; } }').appendTo($('head'));
	$('<style>').html('.ms_replaced { cursor: help; }').appendTo($('head'));
	
	//Cadre principal
	var box = $('<div>').attr('id', 'ms_box').css({
		position: 'absolute', top: '45px', right: '10px', zIndex: 90, //Panneau Twinoid : 99
		backgroundColor: '#171C56', border: '1px solid #213578', boxShadow: '0px 0px 5px #000000',
		fontSize: '0.7em', padding: '4px', width: '300px', overflow: 'hidden',
	}).appendTo($('body'));
	
	var title = $('<p>').css({ marginBottom: '8px', position: 'relative', height: '16px' }).appendTo(box);
	$('<div>').html('<img src="http://mush.vg/img/icons/ui/down.png" alt="open" title="Ouvrir/fermer le cadre" />').css({
		padding: '4px', height: '16px', marginRight: '8px',
		display:' inline-block', verticalAlign: 'middle',
		background: '#213578', opacity: 0.6, cursor: 'pointer',
	}).hover(function() {
		$(this).css('opacity', 1);
	},
	function() {
		if (!$(this).hasClass('ms_active')) {
			$(this).css('opacity', 0.6);
		}
	}).on('click', function() {
		$('#ms_scenario_details').slideToggle(400);
		var arrow = $(this);
		arrow.toggleClass('ms_active');
		if (arrow.hasClass('ms_active')) {
			arrow.find('img').attr('src', 'http://mush.vg/img/icons/ui/up.png');
			arrow.css('opacity', 1);
		}
		else {
			arrow.find('img').attr('src', 'http://mush.vg/img/icons/ui/down.png');
			arrow.css('opacity', 0.6);
		}
	}).appendTo(title);
	$('<img>').attr('src', 'http://mush.blablatouar.com/img/scenario.png').css({ margin: '0 3px', verticalAlign: 'middle' }).appendTo(title);
	$('<b>').text("MushScénario v." + GM_info.script.version).css({ verticalAlign: 'middle', fontSize: '12px' }).appendTo(title);
	
	
	//Chargement du scénario
	if (/[0-9]+/.test(localStorage['ms_scenarioCode']) && !localStorage['ms_scenarioData']) {
		m_loadScenario(localStorage['ms_scenarioCode']);
	}
	if (localStorage['ms_scenarioData']) {
		scenar_data = $.parseJSON(localStorage['ms_scenarioData']);
		if (!scenar_data) {
			console.log(scenar_data);
			alert('MushScénario\n---------------\nUne erreur s\'est produite lors du chargement du scénario...');
			m_leaveScenario();
			return false;
		}
	}
	$('h1.who').before('<h1 class="h1 who" data-m="compatibilityData">' + $('h1.who').text() + '</h1>');
	

	//Cadre des détails du scénario et lancement du script
	var details = $('<div>').attr('id', 'ms_scenario_details').css({
		padding: '4px', background: '#213578'
	}).hide().appendTo(box);
	var ms_code = localStorage['ms_scenarioCode']; 
	if (ms_code != '' && ms_code != undefined) {
		console.log("Code scénario : " + ms_code);
		$('<h4>').text("Scénario en cours :").css({ fontWeight: 'bold', marginLeft: '16px' }).appendTo(details);
		$('<span>').text(scenar_data.title).css({
			display: 'block', width: '100%', paddingLeft: '10px',
		}).appendTo(details);
		
		ms_add_boxlink(details, "Règles", 'http://www.hordes.fr/gfx/forum/smiley/h_warning.gif', ms_display_rules);
		ms_add_boxlink(details, "Introduction", 'http://data.hordes.fr/gfx/icons/item_rp_twin.gif', ms_display_intro);
		ms_add_boxlink(details, "Scénario complet", 'http://mush.vg/img/icons/ui/learned.png', null, 'http://mush.blablatouar.com/scenario/scenario.php?code=' + ms_code);
		details.append('<br />');
		ms_add_boxlink(details, "Tableau des correspondances", 'http://mush.vg/img/icons/ui/pa_comp.png', function() {
			ms_display_table(1, 'item');
			return false;
		});
		
		$('<h4>').text("Actions scénario :").css({ fontWeight: 'bold', marginLeft: '16px', marginTop: '14px' }).appendTo(details);
		ms_add_boxlink(details, "Recharger", 'http://data.twinoid.com/img/icons/refresh.png', function() {
			m_loadScenario(ms_code);
			return false;
		});
		ms_add_boxlink(details, "Quitter", 'http://mush.vg/img/icons/ui/unsociable.png', function() {
			if (confirm('MushScénario\n-------------------------\nVous allez quitter ce scénario. En êtes-vous sûr ?')) {
				m_leaveScenario();
			}
			return false;
		});
		ms_add_boxlink(details, "Nouveau", 'http://www.hordes.fr/gfx/forum/smiley/h_plan.gif', null, 'http://mush.blablatouar.com/scenario/create.php');
		
		//Option astropad
		var astroOption = $('<div>').appendTo(details);
		$('<input>').attr({
			type: 'checkbox', checked: (localStorage['ms_doAstropad'] == 'true') ? true : false, name: 'm_doAstropad'
		}).appendTo(astroOption).on('change', function() {
			if ($(this).is(':checked')) {
				localStorage['ms_doAstropad'] = 'true';
				$('#astro_scrollpanel td').each(m_parseThis);
			}
			else {
				localStorage['ms_doAstropad'] = 'false';
			}
		});
		$('<label>').attr('for', 'm_doAstropad').text("Appliquer à l'onglet Astropad").appendTo(astroOption);
		
		
		//Grand remplacement
		m_replaceNames(scenar_data);


		//Gestion des chargements et rechargements internes
		setInterval(function() {
			if (!$('#ms_refreshblock').length) {
				m_replaceNames();
				$('<div>').attr('id', 'ms_refreshblock').appendTo($('#localChannel')).hide();
			}
			if (localStorage['ms_doAstropad'] == 'true' && $('#astrotab').length && !$('#ms_refreshastro').length) {
				$('#astro_scrollpanel td').each(m_parseThis);
				$('<div>').attr('id', 'ms_refreshastro').appendTo($('#astro_scrollpanel')).hide();
			}
		}, 1000);
		$('#chatBlock').on('scroll', function() {
			if (Main.lmwProcessing) {
				var chatloading = window.setInterval(function() {
					if (!Main.lmwProcessing) {
						clearInterval(chatloading);
						m_replaceNames();
					}
				}, 100);
				return true;
			}
		});
		
		
		//Affichage de l'intro au premier chargement
		if (localStorage['ms_scenarioIntro'] != undefined) {
			ms_display_intro();
			delete localStorage['ms_scenarioIntro'];
		}
	}
	else {
		details.append("Aucun scénario en cours.<br />");
		ms_add_boxlink(details, "Rejoindre un scénario", 'http://www.hordes.fr/gfx/forum/smiley/h_hunter.gif', m_joinScenario);
		ms_add_boxlink(details, "Créer un scénario", 'http://www.hordes.fr/gfx/forum/smiley/h_plan.gif', null, 'http://mush.blablatouar.com/scenario/create.php');
		return false;
	}
}

console.log("MushScénario started");
//window.addEventListener('load', m_init, false);
m_init();

}catch(e){unsafeWindow.console.log(e);}
