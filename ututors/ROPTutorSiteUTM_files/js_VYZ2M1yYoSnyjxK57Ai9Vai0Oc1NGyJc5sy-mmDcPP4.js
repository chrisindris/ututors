(function($) {
  var CAMPAIGN_ERRORS = {
    NO_CAMPAIGN : { message : "Not including campaign", element : "#include-campaign" },
    NO_NAME : { message : "Campaign name is empty or blank", element : "#campaign-name" },
    NO_SOURCE : { message : "Campaign source is empty or blank", element : "#campaign-source" },
    NO_MEDIUM : { message : "Campaign medium is empty or blank", element : "#campaign-medium" },
    NO_CLIPBOARD : { message : "Your browser does not support the clipboard feature.", element: ".campaign-clipboard a" }
  };
  var closeModal = function(ctx) {
    $(ctx).addClass("closing");
    setTimeout($.proxy(function() {
      $(ctx).css("display", "none").removeClass("closing");
      if($(ctx).find('div.messages').length) { $(ctx).find('div.messages').removeClass("error").addClass("status").hide().attr("aria-hidden", "true");  }
    } , ctx), 400);
  };
  var loadDependent = function(trigger) {
    $('.modal .settings div[data-dependency="include-campaign"]').each(function() {
      if($(this).data("dependency-attr") in trigger) {
        if(trigger[$(this).data("dependency-attr")] == ($(this).data("dependency-value"))) {
          $(this).slideDown();
        } else {
          $(this).slideUp();
        }
      }
   });
  };
  var setMessage = function(selector) {
    var messageType = 'status';
    if(arguments.length > 1) {
      messageType = arguments[1];
    }
    if(messageType == "status") {
      $(selector).addClass('status').removeClass('error').attr('aria-visible', 'true').attr('role', 'status').attr('aria-live', 'polite').text("Copied to clipboard!");
    } else if (messageType == "error") {
      $(selector).addClass('error').removeClass('status').attr('aria-visible', 'true').attr('role', 'alert').attr('aria-live', 'assertive').text("Copying to clipboard failed.");
    }
    $(selector).slideDown();
  };
  var copyToClipboard = function(selector, sender, messageBox) {
    $(selector).select();
    try {
      var copied = document.execCommand("copy", false, null);
      if(!copied) {
        // Do manual fallback
        $(selector).bind('copy', function() {
          $(this).select();
          setMessage(messageBox);
          $(sender).siblings('div.tooltip-wrapper').remove();
        });
        $(selector).focus().focusout(function() {  
          $(sender).siblings('div.tooltip-wrapper').remove();  
          $(selector).unbind('copy');
        });
        // Is it mac or windows?
        if(navigator.appVersion.indexOf("OS X") >= 0) {
          $(sender).data("tooltip", "Press &#8984; + C to copy");
        } else {
          $(sender).data("tooltip", "Press Ctrl + C to copy");
        }
        console.log($(sender).data("tooltip"));
        var tip = $('<div class="tooltip-wrapper"><div class="clearfix"></div><div class="tooltip">' + $(sender).data("tooltip") + '</div></div>');
        
        $(sender).after(tip);
      }
      return copied;
    } catch (err) {
      console.log("Browser is not supported");
      return false;
    }
    // return if it copied to clip or not.
    return copied;
  };
  var campaignURIClean = function(val) {
    return val.toLowerCase().replace(/[^\w\d-]/g, "-");
  };
  var includeCampaign = function() {
    return $("#include-campaign").is(":checked");
  }
  var getProtocol = function() {
    return "https://"; //($("#https-enabled").is(":checked") ? "https://" : "http://");
  }
  var getCampaignParams = function(intent) {
    if(!includeCampaign()) { 
      return { 
        valid: false,
        error: CAMPAIGN_ERRORS.NO_CAMPAIGN
      };
    }
    var params = {
      utm_campaign : $.trim($('#campaign-name').val()),
      utm_source : campaignURIClean($.trim($('#campaign-source').val())),
      utm_medium : campaignURIClean($.trim($('#campaign-medium').val()))
    };
    if(params.utm_campaign.length == 0) {
      return {
        valid : false,
        error: CAMPAIGN_ERRORS.NO_NAME
      };
    }
    switch(intent) {
      case "twitter":
      case "facebook":
      case "linkedin":
      //case "googleplus":
        params.utm_medium = 'social';
        params.utm_source = intent;
        break;
      case "email":
        params.utm_medium = 'email';
    }
    if(params.utm_source.length == 0) { // || params.utm_medium == 0) {
      return {
        valid : false,
        error : CAMPAIGN_ERRORS.NO_SOURCE
      };
    } else if (params.utm_medium.length == 0) {
      return {
        valid : false,
        error : CAMPAIGN_ERRORS.NO_MEDIUM
      };
    }
    return {
      valid : true,
      value: $.param(params) 
    };
  };
  Drupal.behaviors.backendLinkWarning = {
    attach: function(context, settings) {
      if($("#warning-label-wrapper").length) {
        var warning = $("#warning-label-wrapper")[0];
        $(warning).bind('update', updateMargins, $(warning));
        $(warning).bind('changeHeight', changeHeight, $(warning));

        $(warning).trigger('update');

        $(window).resize(function(data) {
          $(warning).trigger('update');
        });
        $(window).scroll(function() {
          $(warning).trigger('changeHeight');
        });
      }
      $('.share a').click(function(e) {
        e.preventDefault();
        $('.modal.social').css("display", "block");
      });
      $('.public-link a').click(function(e) {
        e.preventDefault();
        $('.modal.information').css("display", "block");
      });
      $('.modal.information input[name="linktype"]').change(function() {
          var protocol = "";
          if($(this).data("protocol")) {
            protocol = $(this).data("protocol") + "://";
          }
          $("#public-url").val(protocol + $(this).data("uri"));
      });
      $('.modal').click(function(e) {
        e.preventDefault();
        closeModal(this);
      });
      $('.modal a.modal-close').click(function(e) {
        e.preventDefault();
        closeModal($(this).parents('.modal'));
      });
      $('.modal .modal-contents').click(function(e) {
        e.stopPropagation();
      });
      $('a.clipboard').click(function(e) {
        e.preventDefault();
        var copied = copyToClipboard("#public-url", this, '.modal.information .messages');
        if(copied) {
          setMessage('.modal.information .messages');
        } else {
          setMessage('.modal.information .messages', 'error');
        }
        
      });
      $('.modal .settings a').click(function(e) {
        e.preventDefault();
        if($(this).data("intent") == "settings") {
          var panel = $(this).parents('.settings').children('.settings-panel');
          $(".campaign-clipboard-status.status").slideUp();
          panel.slideToggle();
          panel.attr("aria-hidden", panel.attr("aria-hidden") == "true" ? "false" : "true");
          $(this).parents('.modal-contents').toggleClass("expanded");
          $(this).find('i.indicator').toggleClass("fa-caret-down").toggleClass("fa-caret-up");
          loadDependent($('#include-campaign').get(0));
        } else if ($(this).data("intent") == "help") {
          var help_id = "#" + $(this).data("opens");
          $(help_id).slideToggle();
          $(help_id).attr('aria-hidden', $(help_id).attr('aria-hidden') == "true" ? "false" : "true");
        } else if ($(this).data("intent") == "clipboard") {
          // call clipboard function;
          $('.needs-value').removeClass('needs-value');
          var params = getCampaignParams($(this).data("intent"));
          if(!params.valid) { 
            // get the element that was in error and mark it as such.
            $(params.error.element).addClass("needs-value").focus();
            $(".campaign-clipboard-status").addClass("error").html(params.error.message).attr("aria-hidden", "false").attr("aria-role", "alert").attr("aria-live", "assertive").slideDown();
          }
          else {
            $("#campaign-url").val(getProtocol() + $('#campaign-url').data('base-uri') + "?" + params.value); 
            var copied = copyToClipboard("#campaign-url", this, '.modal.social .messages');
            if(copied) {
              setMessage(".campaign-clipboard-status");
            } else {
              // TODO: highlight clipboard button
              setMessage(".campaign-clipboard-status", "error");
            }
          }
        }
      });
      $('#include-campaign').change(function() {
//        var trigger = this;
        loadDependent(this);
      });
      $('.sharer a').click(function(e) {
        e.preventDefault();
        var intent = $(this).data('intent');
        var path = getProtocol() + $('#social-public-path').val();
        $('.needs-value').removeClass('needs-value');
        var campaign = getCampaignParams(intent);
        var params = "";
        if(campaign.valid) {
          params = "?" + campaign.value;
          $(".campaign-clipboard-status").removeClass("error").addClass("status").html("").attr("aria-hidden", "true").attr("aria-role", "status").attr("aria-live", "polite").slideUp();
        } else {
          if(campaign.error != CAMPAIGN_ERRORS.NO_CAMPAIGN){
            $(".campaign-clipboard-status").removeClass("status").addClass("error").html(campaign.error.message).attr("aria-hidden", "false").attr("aria-role", "alert").attr("aria-live", "assertive").slideDown();
            $(campaign.error.element).addClass("needs-value").focus();
            return; // An error obviously occurred, stop executing
          }
        }
        if(intent == "twitter") {
          window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(document.title) + "&url="  + encodeURIComponent(path + params), intent, "width=500,height=255");
        } else if (intent == "facebook") {
          window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(path +params), intent, "width=555,height=586");
        } else if (intent == "linkedin") {
          window.open("https://www.linkedin.com/shareArticle?mini=true&source=U%20of%20T%20Mississauga&url=" + encodeURIComponent(path + params) + "&title="+ encodeURIComponent(document.title),
            intent, "width=500,height=500");
        //} else if (intent == "googleplus") {
        //  window.open("https://plus.google.com/share?url=" + encodeURIComponent(path + params), intent, "width=600,height=600");
        } else if (intent == "email") {
          location.href='mailto:?to=&subject=' + encodeURIComponent(document.title) + "&body=" + encodeURIComponent(path + params);
        }
      });
    }
  };

  function changeHeight(item) {
    var distance = window.pageYOffset || document.documentElement.scrollTop,
      shrinkOn =  $('#header').offset().top + $('#header').height();
    if( distance > shrinkOn) {
      if(! $(this).hasClass('smaller')) {
        $(this).addClass('smaller');
      }
    } else {
      if($(this).hasClass('smaller')) {
        $(this).removeClass('smaller');
      }
    }
  }  

  function updateMargins(item) {
    if($('#toolbar').length) {
      $('body').css('padding-top', $('#toolbar')[0].offsetHeight);
    }
    var diff =  $(this)[0].offsetHeight;
    $(this).css('margin-top', -diff);
    $(this).closest('.section').css('margin-top', diff);
  }
})(jQuery);
;

(function ($) {
Drupal.behaviors.tweetImagePreview = {
  attach: function(context) {
    $('.twtr-media-image').each(function() {
      if($(this).attr('loaded') != 'true') {
        Drupal.behaviors.tweetImagePreview.loadImage($(this));
      }
    });
  },
  loadImage: function (context) {
    var preview = $('<img>');
    preview.load(function(e) {
      $(this).attr('alt', 'embedded image');
      // if portrait, target where face would roughly be, if landscape target center
      // want middle of image at about 35% of image height
      if(this.width >= context.width()) {
        var w_scale = this.width / context.width();
        var new_height = this.height / w_scale;
        // Required because IE returns 0 w/h on hidden images
        var original_dimensions = {
          width : this.width,
          height : this.height
        };
        // If landscape set height to max, else width
        $(this).hide();
        context.append($(this));
        var dim = {
            width : context.outerWidth(),
            height : context.outerHeight()
        };
        var target_aspect = dim.width / dim.height;
        if((original_dimensions.width / original_dimensions.height) <= 1) {
          $(this).css('height', 'auto');
          $(this).css('width', '100%');
        }
        else if((original_dimensions.width / original_dimensions.height) > target_aspect  ) {
          var overhang = -Math.floor(dim.width - (original_dimensions.width * dim.height/original_dimensions.height) / 2);
          $(this).css('height', '100%');
          $(this).css('width', 'auto');
          $(this).css('max-width', 'none');
          $(this).css('left', overhang + 'px');
        } else {
          $(this).css('height', 'auto');
          $(this).css('width', '100%');
        }
        $(this).fadeIn('fast');
      } else {
        var w_scale = this.width; 
        var new_height = this.height / w_scale;
        $(this).addClass('small-media');
        
        context.append($(this)).show(); 
      }
      
      context.attr('loaded', 'true');
    }).attr('src', context.data('url'));
  }
};
Drupal.behaviors.tweetflow = {
  attach: function(context) {
    Drupal.behaviors.tweetflow.checkForTweets();			// intial refresh
    setInterval(Drupal.behaviors.tweetflow.checkForTweets, 30*1000); 	// 30 second interval
  },
  checkForTweets: function() { // set a 30 second interval
    var source_to_count = new Object();
    $('.twitter-source').each(function() {
      var block_id = '#' + this.id;
      var source_id = $(this).data('source-id');  // the source ID for the block
      var block_num = $(this).data('block-num');
      source_to_count[source_id] = $(this).data('display-count'); // get the count
      try {
        var callback = $.ajax( {
          url: Drupal.settings.basePath + 'twitter_blocks/' + source_id,
          dataType: 'html',
          type: 'GET',
          success: function(data, textStatus, other) {
            var tweets = $(data).children(); // Get all the tweets
            var to_add = new Array();
            tweets.each(function() { // foreach tweet
              var this_source_id = $(this).data('source-id');
              var this_tweet_id = $(this).data('tweet-id');
              var exists = $(block_id + " .twtr-tweet").filter(function() { return $(this).data('tweet-id') == this_tweet_id; });
              if(exists.length == 0) { // If this tweet doesn't exist
                $(this).hide();
                $(this).data('source_id', this_source_id);
                $(this).data('tweet_id', this_tweet_id);
                to_add.push($(this));
              } else {
                exists.find(".twtr-timestamp").html(($(this).find('.twtr-timestamp')).html());
              }
            });               // end each tweet
            if(to_add.length >= 1) {
              var this_source_id = to_add[to_add.length-1].data('source_id');
              var display_count = source_to_count[this_source_id];
              Drupal.behaviors.tweetflow.addNewTweets($(block_id), to_add, display_count);
            }
            delete data;
          }                	// end success
        });                 	// end ajax
      } catch (ex) { }        	// end try/catch
    });                       	// end each
  },				// end checkForTweets

  addNewTweets: function(source, tweets, count) {
    if(tweets.length >= 1) {
      var tweet = tweets.shift();
      var tweet_id = tweet.data('tweet-id');
      var first_id = source.find('.twtr-tweet').first().data('tweet-id');
      if(tweet_id > first_id){
        source.prepend(tweet);
        tweet.slideDown("slow");
        Drupal.behaviors.tweetImagePreview.attach(document);
        if(source.find('.twtr-tweet').length > count){
          source.find('.twtr-tweet').last().slideUp(function(){ 
            $(this).remove(); 
            Drupal.behaviors.tweetflow.addNewTweets(source, tweets, count);
          });
        } else {
          Drupal.behaviors.tweetflow.addNewTweets(source, tweets, count);
        }
      } else {
        Drupal.behaviors.tweetflow.addNewTweets(source, tweets, count);
      }  // end consistency of order
    } // end if for tweets length
  } // end addNewTweets
}				// end tweetflow

})(jQuery);

;
