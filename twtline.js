/*
 * Usage
 * Import twtline.js and twtline.css, add <div id="twtline"> </div> elements to HTML page.
 * Add following code between head elements.
 * 	<script language="javascript">
 *		$(document).ready(function() {
 *			$('#twtline').twtline({ name : 'xjcpp', interval : 3500 });
 *		});
 *	</script>
 *  name  - twitter user name
 *  interval - time between changing messages
 */

function TwitterClient(params) {
	var self = this;
	
	this.GetData = function() {
		$.getJSON(self.callbackUrl, self.Append);
	},

	this.Append = function(data) {
		$.each(data, function(_, item) {
				$(self.twits).append($('<li style="display: none">' + 
					item.text.replace(/\s+#(\w+)/ig, ' <a href="http://twitter.com/#!/search?q=%23$1">#$1</a>') + 
					'</li>'));
		});
		
		$(self.htmlObject).append('<table border="0" cellpadding="0" cellspacing="0" width="100%">' +
								  '<tr><td id="twtLogo"><a href="http://twitter.com/' + self.feedName + '">' +
								  '<img src="./bird.png" /></a></td><td id="twtEntries"></td></tr></table>');
		
		$("#twtEntries").append(self.twits);

		self.iterator = $("li:first", self.twits);
		self.iterator.show();
	},
	
	this.ShowTweet = function() {
		self.iterator.fadeOut("slow", function() {
			self.iterator = ($(this).next().length) ? $(this).next() : $("li:first", self.twits);
			self.iterator.fadeIn('slow');
		});
	}
	
	self.callbackUrl = "http://twitter.com/status/user_timeline/" + params.name + ".json?count=10&callback=?";
	self.feedName = params.name;
	self.htmlObject = params.object;

	self.twits = $('<ol id="twtList"></ol>');
	self.iterator = null;
};

jQuery.fn.twtline = function(settings) {
	var client = new TwitterClient({
		'name' : settings.name,
		'object' : this,
		'interval' : settings.interval
	});
	
	client.GetData();
	setInterval(client.ShowTweet, settings.interval);
};