// Shared route grade: the visible stars and earned access use the same curve.
export function gardenFlightStars(flight){
 if(!flight)return 1;
 if(!['medium','hard','professor'].includes(flight.difficulty))return 1;
 const cap=flight.independent?5:flight.ratingCap===4?4:flight.ratingCap===2?2:1;
 let stars=1;const notes=!(flight.toneAttempts>0)||flight.toneAccuracy>=.85;
 if(flight.accuracy>=.65&&flight.laps<=7)stars=2;
 if(flight.accuracy>=.8&&flight.laps<=4)stars=3;
 if(flight.accuracy>=.98&&flight.laps<=1.65&&notes)stars=4;
 if(flight.accuracy===1&&flight.laps<=1.05&&(!(flight.toneAttempts>0)||flight.toneAccuracy===1))stars=5;
 return Math.min(stars,cap);
}
