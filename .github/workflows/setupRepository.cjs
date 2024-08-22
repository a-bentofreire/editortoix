/*
Mainly used to setup repository default pacakge.json contents.
You may delete this file after repo creation if not already deleted by the template setup scripts.
*/

const fs = require('fs');
let github, context, org, repoName;
// Include fs module
  
function _isValidRepoInitEvent(){
    // create event is triggered whenever a new branch is created in the repo. so we do a hack that if the master branch
    // of the repo is created, we consider it as repo creation as master branch is created only on repo create. This
    // should work all the time on create from template and most of the time on external creation.
    if(context.eventName !== 'create'){
        return false;
    }
    if(!context.ref.endsWith(`/${context.payload.master_branch}`)){
        return false;
    }
    return true;
}

function setupPackageJSON() {
    let data = JSON.parse(fs.readFileSync('./package.json', {encoding:'utf8', flag:'r'}));
    data.name = `gh-${org}-${repoName}`;
    data.description = context.payload.repository.description || "A simple phcode.dev extension/theme.";
    data.title = repoName;
    data.license = context.payload.repository.license && context.payload.repository.license.name || "unknown";
    data.author = `${context.payload.repository.owner.login}`;
    data.homepage = context.payload.repository.html_url;
    data.version = "0.0.1";
  
    fs.writeFileSync('./package.json', JSON.stringify(data, null, 4));
    console.log("package.json file written successfully\n", data);
}

async function verifyRepoIsPublic() {
    if(!context.payload.repository.private){
        console.log("Repository is public, all good.");
        return;
    }
    console.log("Repository must be public to publish",
    `Repository must be public to publish the extension to the extension store.\n
    If you want to create a private source extension, create another public repo just to create releases an publich the extension without making the source code public.`
    );
}

async function initRepo(details){
    github = details.github;
    context = details.context;
    org = details.org;
    repoName = details.repoName;
    console.log("github: ", JSON.stringify(github, null, 4));
    console.log("context: ", JSON.stringify(context, null, 4));
    if(!_isValidRepoInitEvent()){
        console.log("Not a valid repo creation event. This task is only meant to be executed at repo creation. Exiting!");
        return;
    }
    setupPackageJSON();
    verifyRepoIsPublic();
    
    // cleanup
    fs.unlinkSync('./.github/workflows/setupRepository.cjs');
    fs.unlinkSync('./.github/workflows/setupRepository.yml');
}

module.exports.initRepo = initRepo;