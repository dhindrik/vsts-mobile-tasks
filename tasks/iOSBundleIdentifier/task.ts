import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import fs = require('fs');
import { isNullOrUndefined } from 'util';

async function run() {
    try {
        let tool: trm.ToolRunner;
        if (process.platform == "win32") {
            tl.setResult(tl.TaskResult.Failed, "Task not supported");
            return;
        }

        let sourcePath: string = tl.getInput("sourcePath");
        let bundleIdentifier: String = tl.getInput("bundleIdentifier");
        let bundleName: String = tl.getInput("bundleName");
        let printFile: Boolean = new Boolean(tl.getInput("printFile")).valueOf();
        
        // requires parameters
        if(isNullOrUndefined(sourcePath))
        {
            throw new Error("[!] Missing required input: sourcePath");
        }

        if(printFile)
        {
            console.log('Original info.Plist:' + fs.readFileSync(sourcePath, 'utf8'));
        }
        
        console.log(' (i) Bundle Identifier- bundleIdentifier: ' + bundleIdentifier);
        
        // print bundle version
        tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleIdentifier\" " + "\"" + sourcePath + "\"");

        // update bundle version
        tl.execSync("/usr/libexec/PlistBuddy", "-c \"Set :CFBundleIdentifier " + bundleIdentifier + "\" " + "\"" + sourcePath + "\"");

         // print bundle version
         tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleIdentifier\" " + "\"" + sourcePath + "\"");


        if(!isNullOrUndefined(bundleName))
        {
            console.log(' (i) Bunglde Name- bundleName: ' + bundleName);

            // print bundle version
            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleName\" " + "\"" + sourcePath + "\"");

            // update bundle version
            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Set :CFBundleName " + bundleName + "\" " + "\"" + sourcePath + "\"");

            // print bundle version
            tl.execSync("/usr/libexec/PlistBuddy", "-c \"Print CFBundleName\" " + "\"" + sourcePath + "\"");
        }



        if(printFile)
        {
            // todo - load plist data
            console.log('Final info.Plist: ' + fs.readFileSync(sourcePath, 'utf8'));
        }
        
        console.log('Task done!');
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
