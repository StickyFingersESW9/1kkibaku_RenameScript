// ==UserScript==
// @name           rename1kibaku
// @version        0.4.8
// @namespace      jp.akb48.rename1kibaku
// @description    ブラウザ一騎当千用リネームスクリプト
// @include        http://*.1kibaku.jp/*
// @run-at         document-end
// @author         指原莉乃(from akb48 本物じゃないよ)
// ==/UserScript==

/*
	名前置換用

	カードNo : {name : "漢字表記", reading : "よみがな" },
*/
var	listRename = {
//	1047 : {name : "大家志津香", reading : "おおやしづか" },	// バニー趙雲
//	4118 : {name : "島崎遥香", reading : "しまざきはるか" },	// ウェディング呂布

	// UC 3.0コスト
	1104 : {name : "諸葛亮孔明", reading : "しょかつりょうこうめい" },
	1132 : {name : "張飛益徳", reading : "ちょうひえきとく" },

	2018 : {name : "曹操孟徳", reading : "そうそうもうとく" },
	2077 : {name : "司馬懿仲達", reading : "しばいちゅうたつ" },
	2085 : {name : "曹仁子孝", reading : "そうじんしこう" },
	2091 : {name : "賈詡文和", reading : "かくぶんわ" },

	3035 : {name : "小嶋菜月", reading : "こじまなつき" },//{name : "孫策伯符", reading : "そんさくはくふ" },
	3045 : {name : "呂蒙子明", reading : "りょもうしめい" },
	3082 : {name : "孫権仲謀", reading : "そんけんちゅうぼう" },

	4017 : {name : "呂布奉先", reading : "りょふほうせん" },
	4078 : {name : "馬超孟起", reading : "ばちょうもうき" },
	4086 : {name : "呂布奉先", reading : "りょふほうせん" },
	4099 : {name : "永尾まりや", reading : "ながおまりや" },//{name : "于吉", reading : "うきつ" },
	4121 : {name : "島崎遥香", reading : "しまざきはるか" },//{name : "胡車児", reading : "こしゃじ" },
	4129 : {name : "孟獲", reading : "もうかく" },

//	1066 : {name : "島崎遥香", reading : "しまざきはるか" },//{name : "胡車児", reading : "こしゃじ" },
};

// オブジェクトの有用性を確認
var isAvailable = function ( e ) {

	if( undefined == e || null == e )return false;

	return true;
};

// カードのクラスがレアリティのものか確認
var funcCheckCardRarity = function ( e ) {

	if( undefined == e.className || null == e.className )return false;

	if( "card rarerity_c" == e.className )return true;
	if( "card rarerity_uc" == e.className )return true;
	if( "card rarerity_r" == e.className )return true;
	if( "card rarerity_sr" == e.className )return true;
	if( "card rarerity_ur" == e.className )return true;

	return false;
};

var funcCheckCardBack = function ( e ) {

	if( undefined == e.className || null == e.className )return false;

	return "card_back" == e.className;
};

var funcCheckCardStatus = function ( e ) {

	if( undefined == e.className || null == e.className )return false;

	if( "cardStatus_rarerity_c" == e.className )return true;
	if( "cardStatus_rarerity_uc" == e.className )return true;
	if( "cardStatus_rarerity_r" == e.className )return true;
	if( "cardStatus_rarerity_sr" == e.className )return true;
	if( "cardStatus_rarerity_ur" == e.className )return true;

	return false;
};


// 「カード表示」の部分の名前の書き換え(簡易版)
var funcRenameCardType2 = function () {

	var elementsCard	= document.getElementsByClassName('cardno');
	var elementsName	= document.getElementsByClassName('name');
	var elementsReading	= document.getElementsByClassName('name2');

	if( !(elementsCard.length == elementsName.length && elementsName.length == elementsReading.length) ){
		GM_log( "検索数が一致していない。やっぱこれじゃダメやな" );
		return;
	}

	for( var i = 0 ; i < elementsCard.length ; i++ ){
		if( isAvailable( listRename[elementsCard[i].innerHTML] ) ){
			elementsName[i].innerHTML		= listRename[elementsCard[i].innerHTML].name;
			elementsReading[i].innerHTML	= listRename[elementsCard[i].innerHTML].reading;
		}
	}

};

function funcSearchChildRenameTarget( e ) {

	for( var i = 0 ; i < e.length ; i++ ){
		if( funcCheckCardStatus( e[i] ) ){
			var	child	= e[i].children || e[i].childNodes;

			// 決め打ちなので将来的にインデックスを変更しないといけない
			if( "cardno" == child[5].className ){
				cardNo	= child[5].innerHTML;
			}

			if( "name" == child[2].className ){
				if( isAvailable( listRename[cardNo] ) ){
					child[2].innerHTML	= listRename[cardNo].name;
				}
			}
		}
		else if( funcCheckCardBack( e[i] ) ){
			var	child	= e[i].children || e[i].childNodes;

			if( "name2" == child[0].className ){
				if( isAvailable( listRename[cardNo] ) ){
					child[0].innerHTML	= listRename[cardNo].reading;
				}
			}
		}
		else{
			var	child	= e[i].children || e[i].childNodes;
			funcSearchChildRenameTarget( child );
		}
	}

};

// 「カード表示」の部分の名前の書き換え
var funcRenameCardType = function () {

	// DIVの階層が違う場所を考慮して再帰で置換
	funcSearchChildRenameTarget( document.getElementsByClassName( 'cardColmn' ) );

	funcSearchChildRenameTarget( document.getElementsByClassName( 'cardWrapper2col' ) );

};

// １５枚表示などのtable形式表示箇所
var funcRenameSmallType = function () {

	var elements	= document.getElementsByTagName( 'table' );
	for( var i = 0 ; i < elements.length ; i++ ){
		if( "statusParameter1" != elements[i].className )continue;
		var	rows = elements[i].rows;
		for( var r = 0 ; r < rows.length ; r++ ){
			var	cols = rows[r].cells.length;
			var	cardNo;
			for( var c = 0 ; c < cols ; c++ ){
				// IDを検索して名前の書き換え用に保持
				if( "ID" == rows[r].cells[c].innerHTML ){
					cardNo	= rows[r].cells[c + 1].innerHTML;
				}

				// 名前項目でない、ＩＤ未設定状態の場合は名前の書き換えに行かない
				if( "" == cardNo || "名前" != rows[r].cells[c].innerHTML )continue;

				// リストに置換項目がある場合、書き換える
				if( isAvailable( listRename[cardNo] ) ){
					rows[r].cells[c + 1].innerHTML	= listRename[cardNo].name;
				}
			}
		}
	}

};

/*
	下級兵士管理の闘士名表示箇所

	@note	内政闘士リスト
	@note	出撃闘士リスト
	@note	トレードリスト
*/
var funcUnitStatus = function () {

	var elements	= document.getElementsByClassName( 'thickbox' );

	for( var n = 0 ; n < elements.length ; n++ ){

		// 出撃中の闘士数(1)びリンク箇所
		if( false == isNaN( elements[n].innerHTML ) )continue;
		// スキルのリンク箇所
		if( -1 != elements[n].innerHTML.indexOf( "LV" ) )continue;
		// 出撃用グラフィックの場合
		var	child	= elements[n].children || elements[n].childNodes;
		if( 0 < child.length )continue;

		// 上記以外の闘士名と思える箇所を置換

		var	nameId	= elements[n].href.substring( elements[n].href.lastIndexOf( "=" ) + 1 );
		var	cardNo;

		var	contents;
		if( document.querySelectorAll ){
			var	searchSelector = "#" + nameId + ">.cardWrapper2col";
			contents	= document.querySelectorAll( searchSelector );
		}
		else{
			var spot	= document.getElementById( nameId );
			contents	= spot.children || spot.childNodes;
		}

		for( var i = 0 ; i < contents.length ; i++ ){
			if( -1 == (' ' + contents[i].className + ' ').indexOf(' cardWrapper2col ') )continue;

			var	contents2	= contents[i].children || contents[i].childNodes;
			for( var j = 0 ; j < contents2.length ; j++ ){
				if( funcCheckCardRarity( contents2[j] ) ){
					var	contents3	= contents2[j].children || contents2[j].childNodes;
					for( var l = 0 ; l < contents3.length ; l++ ){
						if( false == funcCheckCardStatus( contents3[l] ) )continue;

						var	contents4	= contents3[l].children || contents3[l].childNodes;

						// 決め打ちなので将来的にインデックスを変更しないといけない
						if( "cardno" == contents4[5].className ){
							cardNo	= contents4[5].innerHTML;
						}

						if( "name" == contents4[2].className ){
							if( isAvailable( listRename[cardNo] ) ){
								contents4[2].innerHTML	= listRename[cardNo].name;
							}
						}
					}
				}
				else if( funcCheckCardBack( contents2[j] ) ){
					var	contents3	= contents2[j].children || contents2[j].childNodes;
/*
					for( var l = 0 ; l < contents3.length ; l++ ){
						if( "name2" == contents3[l].className ){
							if( isAvailable( listRename[cardNo] ) ){
								contents3[l].innerHTML	= listRename[cardNo].reading;
							}
						}
					}
*/
					if( "name2" == contents3[0].className ){
						if( isAvailable( listRename[cardNo] ) ){
							contents3[0].innerHTML	= listRename[cardNo].reading;
						}
					}
				}
			}
		}

		// クリック箇所の闘士名変更
		if( isAvailable( listRename[cardNo] ) ){
			elements[n].innerHTML	= listRename[cardNo].name;
		}
	}
};

// 出陣（確認）
var funcSendTrooper = function () {

	var	elements	= document.getElementsByClassName( 'minibushodas' );
	var	elemName;
	var	elemImg;

	for( var n = 0 ; n < elements.length ; n++ ){
		var	child0	= elements[n].children || elements[n].childNodes;
		for( var c0 = 0 ; c0 < child0.length ; c0++ ){
			var	child1	= child0[c0].children || child0[c0].childNodes;
			for( var c1 = 0 ; c1 < child1.length ; c1++ ){
				var	child2	= child1[c1].children || child1[c1].childNodes;
				for( var c2 = 0 ; c2 < child2.length ; c2++ ){
					if( "IMG" == child2[c2].tagName ){
						elemImg	= child2[c2];
						break;
					}
				}

				if( "name" == child1[c1].className ){
					elemName	= child1[c1];
				}
			}
		}
	}

	if( isAvailable( elemName ) && isAvailable( elemImg ) ){
		var	cardNo	= elemImg.src.substring( elemImg.src.lastIndexOf( "/" ) + 1).substring( 0, 4 );

		if( isAvailable( listRename[cardNo] ) ){
			if( listRename[cardNo].name.length > 4 ){
				elemName.innerHTML = listRename[cardNo].name.substring( 0, 4 );
			}
			else{
				elemName.innerHTML = listRename[cardNo].name;
			}
		}
	}
};

// ダス
var funcDasu = function () {

	var elements	= document.getElementsByTagName( 'table' );
	for( var i = 0 ; i < elements.length ; i++ ){
		if( "commonTables" != elements[i].className )continue;

		var	rows = elements[i].rows;
		for( var r = 0 ; r < rows.length ; r++ ){
			// ＩＤを表示する箇所が数字以外の場合、ラベルと判別
			if( isNaN( rows[r].cells[0].innerHTML ) )continue;

			// ＩＤがリストにある場合、闘士名を置換する
			if( listRename[rows[r].cells[0].innerHTML] != undefined && listRename[rows[r].cells[0].innerHTML] != null ){
				rows[r].cells[2].innerHTML	= listRename[rows[r].cells[0].innerHTML].name;
			}
		}
	}

};

// ダス結果
var funcDasuResultTitle = function () {

	var elements	= document.getElementsByClassName( 'bushodas_card' );

	for( var n = 0 ; n < elements.length ; n++ ){
		var	child0	= elements[n].children || elements[n].childNodes;
		for( var c0 = 0 ; c0 < child0.length ; c0++ ){
			// funcDasuResultTitle : カードNo.3010&nbsp;孫策伯符&nbsp;
			// ↓
			// funcDasuResultTitle : カードNo.3010&nbsp;「」&nbsp;
			var	str		= child0[c0].innerHTML;
			var	pos0	= str.indexOf( "カードNo." );
			var	pos1	= str.indexOf( "&nbsp;" );
			var	pos2	= str.lastIndexOf( "&nbsp;" );
			if( -1 != pos0 ){
				pos0	+= 6;
				var	cardNo	= str.substring( pos0, pos1 );

				if( listRename[cardNo] != undefined && listRename[cardNo] != null ){
					pos1	+= 6;
					child0[c0].innerHTML	= str.substr( 0, pos1 ) + listRename[cardNo].name + str.substr( pos2, str.length );
				}
			}
		}
	}
};

/*
	ダス結果
*/
var funcDasResult = function () {

	var elements	= document.getElementsByClassName( 'result' );

	for( var n = 0 ; n < elements.length ; n++ ){
		var	cardNo;

		var	child0	= elements[n].children || elements[n].childNodes;
		for( var c0 = 0 ; c0 < child0.length ; c0++ ){
			if( -1 == (' ' + child0[c0].className + ' ').indexOf(' cardWrapper ') )continue;

			var	child1	= child0[c0].children || child0[c0].childNodes;
			for( var c1 = 0 ; c1 < child1.length ; c1++ ){

				if( funcCheckCardRarity( child1[c1] ) ){
					var	child2	= child1[c1].children || child1[c1].childNodes;
					for( var c2 = 0 ; c2 < child2.length ; c2++ ){
						if( false == funcCheckCardStatus( child2[c2] ) )continue;

						var	child3	= child2[c2].children || child2[c2].childNodes;

						// 決め打ちなので将来的にインデックスを変更しないといけない
						if( "cardno" == child3[5].className ){
							cardNo	= child3[5].innerHTML;
						}

						if( "name" == child3[2].className ){
							if( isAvailable( listRename[cardNo] ) ){
								child3[2].innerHTML	= listRename[cardNo].name;
							}
						}
					}
				}
				else if( funcCheckCardBack( child1[c1] ) ){
					var	child2	= child1[c1].children || child1[c1].childNodes;
/*
					for( var l = 0 ; l < child2.length ; l++ ){
						if( "name2" == child2[l].className ){
							if( isAvailable( listRename[cardNo] ) ){
								child2[l].innerHTML	= listRename[cardNo].reading;
							}
						}
					}
*/
					if( "name2" == child2[0].className ){
						if( isAvailable( listRename[cardNo] ) ){
							child2[0].innerHTML	= listRename[cardNo].reading;
						}
					}
				}
			}

		}
	}
};

// 「カード表示」の部分の名前の書き換え
var funcResultLearn = function () {

	var elements	= document.getElementsByClassName( 'cardColmn' );

	var	cardNo		= "";
	var	defName		= "";

	for( var n = 0 ; n < elements.length ; n++ ){

		var	child0	= elements[n].children || elements[n].childNodes;
		for( var c0 = 0 ; c0 < child0.length ; c0++ ){
			if( -1 == (' ' + child0[c0].className + ' ').indexOf(' cardWrapper ') )continue;

			var	child1	= child0[c0].children || child0[c0].childNodes;
			for( var c1 = 0 ; c1 < child1.length ; c1++ ){

				if( funcCheckCardRarity( child1[c1] ) ){
					var	child2	= child1[c1].children || child1[c1].childNodes;
					for( var c2 = 0 ; c2 < child2.length ; c2++ ){
						if( false == funcCheckCardStatus( child2[c2] ) )continue;

						var	child3	= child2[c2].children || child2[c2].childNodes;

						// 決め打ちなので将来的にインデックスを変更しないといけない
						if( "cardno" == child3[5].className ){
							cardNo	= child3[5].innerHTML;
						}

						if( "name" == child3[2].className ){
							if( isAvailable( listRename[cardNo] ) ){
								defName				= child3[2].innerHTML;
								child3[2].innerHTML	= listRename[cardNo].name;
							}
						}
					}
				}
			}
		}
	}

	if( "" != cardNo && "" != defName ){
		for( var n = 0 ; n < elements.length ; n++ ){

			var	child0	= elements[n].children || elements[n].childNodes;
			for( var c0 = 0 ; c0 < child0.length ; c0++ ){
				if( -1 == (' ' + child0[c0].className + ' ').indexOf(' cardWrapper ') )continue;

				var	child1	= child0[c0].children || child0[c0].childNodes;
				for( var c1 = 0 ; c1 < child1.length ; c1++ ){

					if( funcCheckCardBack( child1[c1] ) ){
						var	child2	= child1[c1].children || child1[c1].childNodes;
						for( var c2 = 0 ; c2 < child2.length ; c2++ ){

							if( "name2" == child2[0].className ){
								if( isAvailable( listRename[cardNo] ) ){
									child2[0].innerHTML	= listRename[cardNo].reading;
								}
							}
						}
					}
				}
			}
		}

		/*
			○○LvXXは△△LvXXを習得しました
		*/
		var elements2	= document.getElementsByClassName( 'lead' );
		for( var n2 = 0 ; n2 < elements2.length ; n2++ ){
			var	child10	= elements2[n2].children || elements2[n2].childNodes;
			for( var c10 = 0 ; c10 < child10.length ; c10++ ){
				var	strHTML	= "" + child10[c10].innerHTML;
				strHTML	= strHTML.replace( "" + defName, listRename[cardNo].name );
				child10[c10].innerHTML	= strHTML;
			}
		}
	}
};


// エントリポイント
( function(){

	// 特定のページで動作するようにする（軽量化になるか？）
	var	isExecCardType = false;
	var	isExecSmallType = false;
	var	isExecUnitStatus = false;
	var	isExecSendTrooper = false;
	var	isExecDasu = false;
	var	isExecDasuResultTitle = false;
	var	isExecDasuResult = false;
	var	isExecResultLearn = false;

	// デッキ
	if( location.pathname == "/card/deck.php" ){
		isExecCardType = true;
		isExecSmallType	= true;
	}

	// 下級闘士管理
	if( location.pathname == "/facility/unit_status.php" ){
		isExecUnitStatus	= true;
	}

	// 出陣
	if( location.pathname == "/facility/castle_send_troop.php" ){
		isExecCardType		= true;
		isExecUnitStatus	= true;
		isExecSendTrooper	= true;
	}

	// 内政設定
	if( location.pathname == "/card/domestic_setting.php" ){
		isExecUnitStatus	= true;
	}

	// 合成
	if( location.pathname == "/union/index.php" ){
		isExecCardType	= true;
	}
	// 合成（Ｌｖアップ）
	if( location.pathname == "/union/lvup.php" ){
		isExecCardType	= true;
	}
	if( location.pathname == "/union/union_lv.php" ){
		isExecCardType	= true;
	}
	if( location.pathname == "/union/add_lv.php" ){
		isExecCardType	= true;
	}
	if( location.pathname == "/union/result_lv.php" ){
		isExecCardType	= true;
	}
	// 合成（スキル習得）
	if( location.pathname == "/union/learn.php" ){
		isExecCardType	= true;
	}
	if( location.pathname == "/union/union_learn.php" ){
		isExecCardType	= true;
	}
	if( location.pathname == "/union/result_learn.php" ){
		isExecResultLearn	= true;
	}
	// 合成（修行合成）
	if( location.pathname == "/union/expup.php" ){
		isExecCardType	= true;
	}
	if( location.pathname == "/union/union_expup.php" ){
		isExecCardType	= true;
	}
	if( location.pathname == "/union/result_expup.php" ){
		isExecResultLearn	= true;
	}
	// 合成（スキル削除）
	if( location.pathname == "/union/remove.php" ){
		isExecCardType	= true;
	}

	// トレード（トレード）
	if( location.pathname == "/card/trade.php" ){
		isExecUnitStatus	= true;
	}
	// トレード（出品中）
	if( location.pathname == "/card/exhibit_list.php" ){
		isExecUnitStatus	= true;
	}
	// トレード（入札中）
	if( location.pathname == "/card/bid_list.php" ){
		isExecUnitStatus	= true;
	}
	if( location.pathname == "/card/trade_bid.php" ){
		isExecCardType		= true;
	}

	// トレード（出品選択）
	if( location.pathname == "/card/trade_card.php" ){
		isExecCardType	= true;
	}
	// トレード（ＴＰ入力）
	if( location.pathname == "/card/exhibit_confirm.php" ){
		isExecCardType	= true;
	}
	// ×：トレード（一覧）

	// トーシダス結果
	if( location.pathname == "/busyodas/busyodas_result.php" ){
		isExecDasuResultTitle	= true;
		isExecDasuResult		= true;
	}

	// トーシダス履歴
	if( location.pathname == "/busyodas/busyodas_history.php" ){
		isExecDasu	= true;
	}

	// ×：合成履歴
	// ×：レポート

	// 闘士アルバム
	if( location.pathname == "/card/busyobook_card.php" ){
		isExecCardType		= true;
	}

	// document-endタイミングで置き換え実行（それは@で指定してるから？よくわかんない）
	if( isExecCardType )funcRenameCardType();
	if( isExecSmallType )funcRenameSmallType();
	if( isExecUnitStatus )funcUnitStatus();
	if( isExecSendTrooper )funcSendTrooper();
	if( isExecDasu )funcDasu();
	if( isExecDasuResultTitle )funcDasuResultTitle();
	if( isExecDasuResult )funcDasResult();
	if( isExecResultLearn )funcResultLearn();

}) ();

