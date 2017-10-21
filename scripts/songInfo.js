function changeInfo(title, description, instrument, participants, lyrics, album, preferrence){
	$("#titleInfo").html(title);
	$("#descriptionInfo").html(description);
	$("#instrumentInfo").html("<b>Instrument:</b> "+instrument);
	$("#participantsInfo").html("<b>No. of participants:</b> "+participants);
	$("#lyricBox").html(lyrics.replace(/\n/g, "<br>"));
	$("#albumCover").attr("src", album);
	$("#preferrenceInfo").html("<b>Requester's remark:</b> "+preferrence);
}

changeInfo("The Coast", 
			"This is the description part. This is the description part. This is the description part. This is the description part. ", 
			"piano", 
			1000, 
			"Lighthouses and seashells,\nAlong a salty coast.\nA whisper of wind,\nCarries kites to fly with birds.\nSurfers ride the waves,\nLike a kid with a new bike.\n\nWhile castles built for kings,\nWait for high tide.\nAlong the endless shoreline,\nWe will watch the boats.\nSomeday we will live along our friend,\nThe coast.",
			"https://spark.adobe.com/images/landing/examples/design-music-album-cover.jpg", 
			"bright");