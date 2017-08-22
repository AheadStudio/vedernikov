(function($) {
	var VEDERNIKOV = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {
			header: {
				init: function() {
					BackgroundCheck.init({
						targets: ".header-logo",
						images: ".section-item-photo-holder, .news-item-photo, .cat-item-bg"
					});

					$sel.window.on("scroll", function() {
						var sTop = $(this).scrollTop();
						if(sTop > $sel.window.height() * 0.65) {
							$(".page-header").addClass("show");
						} else {
							$(".page-header").removeClass("show");
						}
					});
				}
			},

			menu: {
				$burger: false,
				$menu: false,
				isShow: false,
				init: function() {
					var self = this;

					self.$burger = $(".header-menu-burger", $sel.body);
					self.$menu = $(".panel", $sel.body);

					$sel.body.append('<div class="menu-overlay"></div>');
					self.$burger.on("click", function() {
						self.isShow ? self.hide() : self.show();
					});
					$(".menu-overlay", $sel.body).on("click", function() {
						self.hide();
					});
				},
				show: function() {
					var self = this;

					self.$menu.css("display", "block");
					setTimeout(function() {
						self.isShow = true;
						self.$burger.addClass("active");
						$sel.body.addClass("show-menu");
					}, 50);
				},
				hide: function() {
					var self = this;

					self.isShow = false;
					self.$burger.removeClass("active");
					$sel.body.removeClass("show-menu");
					setTimeout(function() {
						self.$menu.css("display", "none");
					}, 550);
				}
			},

			scrollAnimation: {
				blocks: [],
				init: function() {
					var self = this;
					$("[data-animationtype]").each(function() {
						var $item = $(this);
						self.blocks.push({
							"html": $item,
							"top": $item.offset().top
						});
						$item.addClass("beforeanimate");
					});

					$sel.window.on("scroll", function() {
						self.check();
					});
					setTimeout(function() {
						self.check();
					}, 1200);

				},
				check: function() {
					var self = this,
						block = false,
						blockTop = false,
						top = $sel.window.scrollTop(),
						buffer = parseInt($sel.window.height()) / 1.8;
					for(var i = 0, len = self.blocks.length; i < len; i++) {
						block = self.blocks[i],
						blockTop = parseInt(block.top, 10);
						if(block.html.hasClass("animated")) {
							continue;
						}
						if(top + buffer >= blockTop) {
							block.html.addClass("animated");
						}

					}
				}
			},

			firstLoad: {
				loaded: false,
				init: function() {
					var self = this;

					$sel.window.on("scroll touchmove mousewheel", function(e) {
						if(self.loaded == false) {
							e.preventDefault();
						    e.stopPropagation();
							return false;
						}
					});
					setTimeout(function() {
						$(".page-preloader").addClass("active");
					}, 300);
					$sel.window.on("load", function() {
						$("html, body").animate({ scrollTop: 0 }, 100);

						setTimeout(function() {
							$(".page-preloader").addClass("disabled");
							setTimeout(function() {
								$(".page-preloader").remove();
								$sel.body.addClass("loaded");
								self.loaded = true;
							}, 1000);

						}, 2000);
					});
				}
			}

		};


	})();

	VEDERNIKOV.menu.init();
	VEDERNIKOV.header.init();
	VEDERNIKOV.scrollAnimation.init();
	VEDERNIKOV.firstLoad.init();


})(jQuery);
