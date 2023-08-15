var rule = {
	title:'MP4电影[磁]',
	host:'https://www.mp4us.com',
        homeUrl: '/',
	url: '/list/fyclass-fypage.html?',
	filter_url:'{{fl.class}}',
	filter:{
	},
	searchUrl: '/search/**-1.html',
	searchable:2,
	quickSearch:0,
	filterable:0,
	headers:{
		'User-Agent': 'PC_UA',
         	'Cookie':''
	},
	timeout:5000,
	class_name: '动作片&科幻片&爱情片&喜剧片&恐怖片&战争片&剧情片&纪录片&动画片&电视剧',
	class_url: '1&2&3&4&5&6&7&8&9&10',
	play_parse:true,
	play_json:[{
		re:'*',
		json:{
			parse:0,
			jx:0
		}
	}],
	lazy:'',
	limit:6,
	推荐:'div.index_update ul li;a&&Text;;b&&Text;a&&href',
	一级:'div#list_all ul li;img.lazy&&alt;img.lazy&&data-original;span.update_time&&Text;a&&href',
	二级:{
		title:"div.article-header h1&&Text",
		img:"div.article-header div.pic img&&src",
		desc:'div.article-header div.text&&Text',
		content:'div.article-related.info p&&Text',
		tabs:`js:
			pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;
			TABS=[]
			var d = pdfa(html, 'ul.down-list&&li');
			let magnetIndex=0;
			let ed2kIndex=0;
			d.forEach(function(it) {
				let burl = pdfh(it, 'a&&href');
				log("burl >>>>>>" + burl);
				if (burl.startsWith("magnet")){
					let result = 'magnet' + magnetIndex;
					magnetIndex = magnetIndex + 1;
					TABS.push(result);
				}
			});
			d.forEach(function(it) {
				let burl = pdfh(it, 'a&&href');
				log("burl >>>>>>" + burl);
				if (burl.startsWith("ed2k")){
					let result = 'ed2k' + ed2kIndex;
					ed2kIndex = ed2kIndex + 1;
					TABS.push(result);
				}
			});
			log('TABS >>>>>>>>>>>>>>>>>>' + TABS);
		`,
		lists:`js:
			log(TABS);
			pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;
			LISTS = [];
			var d = pdfa(html, 'ul.down-list&&li');
			TABS.forEach(function(tab) {
				log('tab >>>>>>>>' + tab);
				if (/^magnet/.test(tab)) {
					let targetindex = parseInt(tab.substring(6));
					let index = 0;
					d.forEach(function(it){
						let burl = pdfh(it, 'a&&href');
						if (burl.startsWith("magnet")){
							if (index == targetindex){
								let title = pdfh(it, 'a&&Text');
								log('title >>>>>>>>>>>>>>>>>>>>>>>>>>' + title);
								log('burl >>>>>>>>>>>>>>>>>>>>>>>>>>' + burl);
								let loopresult = title + '$' + burl;
								LISTS.push([loopresult]);
							}
							index = index + 1;
						}
					});
				}
			});
			TABS.forEach(function(tab) {
				log('tab >>>>>>>>' + tab);
				if (/^ed2k/.test(tab)) {
					let targetindex = parseInt(tab.substring(4));
					let index = 0;
					d.forEach(function(it){
						let burl = pdfh(it, 'a&&href');
						if (burl.startsWith("ed2k")){
							if (index == targetindex){
								let title = pdfh(it, 'a&&Text');
								log('title >>>>>>>>>>>>>>>>>>>>>>>>>>' + title);
								log('burl >>>>>>>>>>>>>>>>>>>>>>>>>>' + burl);
								let loopresult = title + '$' + burl;
								LISTS.push([loopresult]);
							}
							index = index + 1;
						}
					});
				}
			});
			`,

	},
	搜索bak:'div#list_all li;img.lazy&&alt;img.lazy&&src;div.text_info h2&&Text;a&&href;p.info&&Text',
	搜索:`js:
		pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;
    		if (rule_fetch_params.headers.Cookie.startsWith("http")){
			rule_fetch_params.headers.Cookie=fetch(rule_fetch_params.headers.Cookie);
			let cookie = rule_fetch_params.headers.Cookie;
			setItem(RULE_CK, cookie);
		};
		log('mp4us seach cookie>>>>>>>>>>>>>' + rule_fetch_params.headers.Cookie);
                let _fetch_params = JSON.parse(JSON.stringify(rule_fetch_params));
		//log("mp4us search params>>>>>>>>>>>>>>>" + JSON.stringify(_fetch_params));
                let search_html = request( HOST + '/search/' + KEY + '-1.html', _fetch_params)
		//log("mp4us search result>>>>>>>>>>>>>>>" + search_html);
		let d=[];
		//'div#list_all li;img.lazy&&alt;img.lazy&&src;div.text_info h2&&Text;a&&href;p.info&&Text',
		let dlist = pdfa(search_html, 'div#list_all li');
		dlist.forEach(function(it){
			let title = pdfh(it, 'img.lazy&&alt');
			if (searchObj.quick === true){
				if (title.includes(KEY)){
					title = KEY;
				}
			}
			let img = pd(it, 'img.lazy&&src', HOST);
			let content = pdfh(it, 'div.text_info h2&&Text');
			let desc = pdfh(it, 'p.info&&Text');
			let url = pd(it, 'a&&href', HOST);
			d.push({
				title:title,
				img:img,
				content:content,
				desc:desc,
				url:url
				})
		});
		setResult(d);
	`,
	预处理:`
    		if (rule_fetch_params.headers.Cookie.startsWith("http")){
			rule_fetch_params.headers.Cookie=fetch(rule_fetch_params.headers.Cookie);
			let cookie = rule_fetch_params.headers.Cookie;
			setItem(RULE_CK, cookie);
		};
		log('mp4us init cookie>>>>>>>>>>>>>>>' + rule_fetch_params.headers.Cookie);
	`,
	proxy_url_bak: `js:
                let _fetch_params = JSON.parse(JSON.stringify(rule_fetch_params));
                let proxy_html = request( 'http://127.0.0.1:10079/?thread=0&proxy=socks5://192.168.101.1:1080&url=' + encodeURIComponent(input), _fetch_params);
		input = [200, "text/html", proxy_html];
	`,
}
