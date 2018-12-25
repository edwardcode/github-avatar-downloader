const request      = require('request');
const GITHUB_TOKEN = require("./secrets");
const fs           = require('fs');
const repoOwner    = process.argv[2];
const repoName     = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

//the function makes a request for JSON, getting back an array of contributors.
function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers:{
      'User-Agent': 'request',
      'Authorization': GITHUB_TOKEN
    }
  };

  if(repoOwner && repoName) {
    request(options, function(err, res, body){
      let data = JSON.parse(body);
      cb(err, data);
    });
  } else {
    console.log("repoOwner & repoName all information needed.");
  }
}

//the function fetches the desired avatar_url and saves this information to the given filePath
function downloadImageByURL(url, filePath) {
  request.get(url)

  .on('error', function (err) {
    throw err;
  })

 .pipe(fs.createWriteStream(filePath ))
 .on('finish', function(){
    console.log('Download complete.');
  });
}


getRepoContributors(repoOwner, repoName, function(err, result){
  if(err){
    console.log("Errors:", err);
  } else {
     for (var arr of result){
       downloadImageByURL(arr.avatar_url, "./avatars/" + arr.login + ".jpg");
     }
  };
})
