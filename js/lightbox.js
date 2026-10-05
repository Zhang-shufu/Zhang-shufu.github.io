/* 作品集轮播灯箱：点击作品 → 同类别照片轮播，背景为当前照片模糊图 */
(function ($) {
	'use strict';

	var CAT_RE = /(?:^|\s)(qz|hwd|gzwq|wlzc|wb|tlc|hwcp|xnjx|qp|hy|qj|sgq)(?:\s|$)/;
	var catName = {
		qz: '亲子时光', hwd: '四合院韵', gzwq: '温泉古韵', wlzc: '围炉茶叙',
		wb: '外宾风采', tlc: '天伦王朝·婚礼', hwcp: '草坪婚礼', xnjx: '新年雪韵',
		qp: '旗袍雅韵', hy: '狐妖国风', qj: '秋日私语', sgq: '首钢秋色'
	};

	var all = [];
	var curList = [];
	var curIndex = 0;
	var $lb, $bg, $img, $cat, $count;

	function build() {
		$lb = $('<div class="sw-lightbox" id="swLightbox">' +
			'<div class="sw-bg"></div>' +
			'<button class="sw-close" type="button" aria-label="关闭">&times;</button>' +
			'<button class="sw-prev" type="button" aria-label="上一张">&#10094;</button>' +
			'<button class="sw-next" type="button" aria-label="下一张">&#10095;</button>' +
			'<div class="sw-stage"><img id="swImg" src="" alt=""></div>' +
			'<div class="sw-info"><span class="sw-cat"></span><span class="sw-count"></span></div>' +
			'</div>').appendTo('body');
		$bg = $lb.find('.sw-bg');
		$img = $lb.find('#swImg');
		$cat = $lb.find('.sw-cat');
		$count = $lb.find('.sw-count');

		// 收集全部作品（按 DOM 顺序）
		$('.gallery-item').each(function () {
			var cls = $(this).attr('class') || '';
			var m = cls.match(CAT_RE);
			var a = $(this).find('a.gallery-link')[0];
			if (!a || !m) { return; }
			all.push({ src: a.getAttribute('href'), cat: m[1], alt: a.getAttribute('data-alt') || '' });
		});

		// 点击分类标签 → 直接弹出该分类全部照片的轮播
		// （main.js 的 isotope 处理 return false 阻止冒泡，须直接绑定）
		$('.gallery-filter li.filter').on('click', function () {
			var filter = $(this).attr('data-filter') || '*';
			var cat = filter.replace('.', '');
			if (cat === '*') {
				curList = all.slice();
			} else {
				curList = all.filter(function (it) { return it.cat === cat; });
			}
			curIndex = 0;
			open();
		});

		// 点击作品打开轮播
		$(document).on('click', '.gallery-link', function (e) {
			e.preventDefault();
			var src = this.getAttribute('href');
			var $item = $(this).closest('.gallery-item');
			var cls = $item.attr('class') || '';
			var m = cls.match(CAT_RE);
			var cat = m ? m[1] : '';
			// 同类别的全部照片
			curList = all.filter(function (it) { return it.cat === cat; });
			curIndex = 0;
			for (var i = 0; i < curList.length; i++) {
				if (curList[i].src === src) { curIndex = i; break; }
			}
			open();
		});

		// 关闭
		$lb.on('click', function (e) {
			if (e.target === this || $(e.target).hasClass('sw-bg') || $(e.target).hasClass('sw-stage')) { close(); }
		});
		$lb.find('.sw-close').on('click', close);
		// 切换
		$lb.find('.sw-prev').on('click', function () { step(-1); });
		$lb.find('.sw-next').on('click', function () { step(1); });
		// 键盘
		$(document).on('keydown', function (e) {
			if (!$lb.hasClass('open')) { return; }
			if (e.key === 'Escape') { close(); }
			else if (e.key === 'ArrowLeft') { step(-1); }
			else if (e.key === 'ArrowRight') { step(1); }
		});
	}

	function open() {
		if (!curList.length) { return; }
		$lb.addClass('open');
		$('body').css('overflow', 'hidden');
		show();
	}
	function close() {
		$lb.removeClass('open');
		$('body').css('overflow', '');
	}
	function step(dir) {
		if (!curList.length) { return; }
		curIndex = (curIndex + dir + curList.length) % curList.length;
		show();
	}
	function show() {
		var it = curList[curIndex];
		$img.attr('src', it.src).attr('alt', it.alt);
		$cat.text(catName[it.cat] || it.alt || '');
		$count.text((curIndex + 1) + ' / ' + curList.length);
		$bg.css('background-image', 'url("' + it.src + '")');
	}

	$(function () {
		build();
	});
})(jQuery);
