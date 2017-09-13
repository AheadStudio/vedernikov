(function($) {
	var VEDERNIKOV = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {
			header: {
				init: function() {
					var self = this;

					if($sel.body.hasClass("page-home") || $sel.body.hasClass("page-intro")) {
						self.bg();
					}
					if($sel.body.hasClass("page-home")) {
						self.scroll();
					}
				},

				bg: function() {
					var imagesSel = ".section-item-photo-holder, .news-item-photo, .cat-item-bg, .catalog-item-photo, .intro-bg, .image > img, .about-block img";
					if(!$(imagesSel).length) {
						return false;
					}
					BackgroundCheck.init({
						targets: ".header-logo",
						images: imagesSel
					});
				},

				scroll: function() {
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

			ajaxPager: {
				init: function() {
					$sel.body.on("click", ".load-more", function(e) {
						var $link = $(this);
						(function($link, href, $container, selector) {
							$link.addClass("loading");
							$.ajax({
								url: href,
								data: {
									"IS_AJAX": "Y"
								},
								success: function(data) {
									var $data = $('<div />').append(data),
										$items = $data.find(selector),
										$preloader = $data.find(".load-more-holder");

									$items.addClass("loaded-item loaded-item--hidden");
									$link.parent().remove();

									$container.append($items);
									if($preloader && $preloader.length) {
										$container.append($preloader);
									}
									VEDERNIKOV.scrollAnimation.init();
									setTimeout(function() {
										$container.find(".loaded-item--hidden").removeClass("loaded-item--hidden").addClass("loader-item--visible");
									}, 50);
								}
							});
						})($link, $link.attr("href"), $($link.data("container")), $link.data("itemsselector"))

						e.preventDefault();
					});
				}
			},

			scrollAnimation: {
				blocks: [],
				init: function() {
					var self = this;
					$("[data-animationtype]:not(.animated), [data-animation]:not(.animated)").each(function() {
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
					}, 50);

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

								VEDERNIKOV.scrollAnimation.init();

							}, 1000);

						}, 2000);
					});
				}
			},


			forms: {
				init: function($container) {
					if(!$container) {
						var $container = $sel.body;
					}

					jcf.setOptions("Select", {
						wrapNative: false,
						wrapNativeOnMobile: false
					});
					var $selects = $(".form-item--select", $container);
					$selects.each(function(i) {
						var $select = $(this),
							selectPlaceholder = $select.attr("placeholder");

						if(selectPlaceholder) {
							$select.prepend('<option class="hideme" selected>' + selectPlaceholder + '</option>');
						}

						jcf.replace($select);
					});

					$(".form-item--checkbox", $container).each(function() {
						var $ch = $(this);

						jcf.replace($ch, "Checkbox", {
							addClass: $ch.data("htmlclass") ? $ch.data("htmlclass") : ""
						});
					});

					$(".form-item--radio, .filter-item-field", $container).each(function() {
						var $rd = $(this);

						jcf.replace($rd, "Radio", {
							addClass: $rd.data("htmlclass") ? $rd.data("htmlclass") : "",
							spanColor: $rd.data("spancolor") ? $rd.data("spancolor") : ""
						});
					});
					
					jcf.replace($(".form-item--number", $container));
					jcf.replace($(".form-item--range", $container));

					/*$("[data-pattern]").each(function() {
						var $item = $(this);
						$item.mask($item.data("pattern"));
					});*/

					/*$.validator.setDefaults({
						errorClass: "form-item--error",
						errorElement: "span"
					});
					$.validator.addMethod("mobileRU", function(phone_number, element) {
						phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
						return this.optional(element) || phone_number.length > 5 && phone_number.match(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{6,10}$/);
					}, "Error");
					$(".form", $container).each(function() {
						var $form = $(this),
							formParams = {
								rules: {

								},
								messages: {
								}
							},
							$formFields = $form.find("[data-error]");
						$formFields.each(function() {
							var $field = $(this),
								fieldPattern = $field.data("pattern"),
								fieldError = $field.data("error");
							if(fieldError) {
								formParams.messages[$field.attr("name")] = $field.data("error");
							} else {
								formParams.messages[$field.attr("name")] = "Ошибка заполнения";
							}
							if(fieldPattern) {
								formParams.rules[$field.attr("name")] = {};
								formParams.rules[$field.attr("name")][fieldPattern] = true;
							}
						});
						formParams.rules["profile-new-password2"] = {
							equalTo: "#profile-new-password1"
						};
						if($form.data("success")) {
							formParams.submitHandler = function(form) {
								$.magnificPopup.open({
									items: {
										src: $form.data("success"),
										type: "inline"
									},
									mainClass: "mfp-fade",
									removalDelay: 300
								});
							};
						}
						$form.validate(formParams);
					});*/
				}
			},

			catalog: {
				init: function() {
					var self = this;

					self.filter.init();
					self.product.init();
				},
				filter: {
					init: function() {
						var self = this;
						$(".filter-item-field", $sel.body).on("change", function() {
							self.sort($("[name=f1]:checked").val());
						});
					},
					sort: function(type) {
						$(".catalog-item").addClass("catalog-item--empty");
						if(type == "all") {
							$(".catalog-item").removeClass("catalog-item--empty");
						} else {
							$(".catalog-item[data-type=" + type + "]").removeClass("catalog-item--empty");
						}
					}
				},
				product: {
					init: function() {
						$(".product-photo-inner", $sel.body).stick_in_parent();
					}
				}
			},

			popup: {
				init: function($container) {
					if(!$container) {
						var $container = $sel.body;
					}
					$(".popup", $container).each(function() {
						(function($p) {
							$p.magnificPopup({
								type: $p.data("type") ? $p.data("type") : "ajax",
								mainClass: "mfp-fade",
								removalDelay: 300,
								tClose: "Закрыть (ESC)",
								tLoading: "Загрузка...",
								callbacks: {
									
								}
							});
						})($(this));
					});
				}
			},

			places: {
				$content: false,
				init: function() {
					var self = this;
					self.$content = $(".city-content", $sel.body);
					$("#city", $sel.body).on("change", function() {
						var city = $(this).find(":selected").val();
						self.load(city);
					});
				},
				load: function(city) {
					var self = this;
					self.$content.addClass("loading");
					setTimeout(function() {
						$.ajax({
							url: "buy.html",
							data: {
								city: city
							},
							success: function(html) {
								var $data = $('<div />').append(html);
								self.$content.empty().append($data.find(".city-content").html());
								self.$content.removeClass("loading");
							}
						});
					}, 350);
				}
			},

			content: {
				tabs: {
					init: function() {
						var self = this;
						$sel.body.on("click", ".tab-heading-item", function(e) {
							var $item = $(this),
								$tabs = $item.closest(".tabs"),
								itemID = $item.attr("href").replace("#", "");
							if(!$tabs.hasClass("inactive")) {
								if(!$item.hasClass("active")) {
									self.hideAll($tabs);
									self.show(itemID, $tabs);
								}
								e.preventDefault();
							}
						});
					},
					show: function(tabID, $tabs) {
						$(".tab-heading-item[href*=" + tabID + "]", $tabs).addClass("active");
						$(".tab-content-item[id*=" + tabID + "]", $tabs).addClass("active");
					},
					hide: function(tabID, $tabs) {
						$(".tab-heading-item[href*=" + tabID + "]", $tabs).removeClass("active");
						$(".tab-content-item[id*=" + tabID + "]", $tabs).removeClass("active");
					},
					hideAll: function($tabs) {
						$(".tab-heading-item", $tabs).removeClass("active");
						$(".tab-content-item", $tabs).removeClass("active");
					}
				},
				init: function() {
					var self = this;

					self.tabs.init();
				}
			}

		};


	})();

	VEDERNIKOV.menu.init();
	VEDERNIKOV.header.init();
	VEDERNIKOV.firstLoad.init();
	VEDERNIKOV.forms.init();
	VEDERNIKOV.ajaxPager.init();
	VEDERNIKOV.catalog.init();
	VEDERNIKOV.popup.init();
	VEDERNIKOV.content.init();
	VEDERNIKOV.places.init();


})(jQuery);
