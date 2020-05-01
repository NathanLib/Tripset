
# Welcome to Tripset!

To launch the project on my **CODIO**, you will normally just have to do `npm start`

But in case something goes wrong, some manipulations are necessary - we apologize for this inconvenience. 

## Step One
Edit the file **package.json**
At the line **"mongodb"**, change the value **"^3.2.7"** to **"^2.2.33"**

*Normally it's already done, but just in case...*

The reason of this change is that, working the project locally, it was impossible to install the version of MongoDB used by Codio (2.4.9). So I had to install the version 3.2. However, this version is not compatible with Codio's one. 
In order to make it work, I was careful to use only functions that already exist with the Codio version, and I modify the version of the library used by the project just before installing everything. 
That way, everything works as desired! 😁

## Step Two
Type `npm install`

Pretty easy but very important!
The packages.json file contains a list of all the packages required to run our project.
NPM can read this and install all the required packages for us!

*You can ignore the message :* <br/>
"found 2 high severity vulnerabilities <br/> run `npm audit fix` to fix them, or `npm audit` for details" <br/>
*This comes from the version selected for MongoDB. However, if you are using the latest version, CODIO cannot launch the application!*

## Step Three
Type *(all as one line)* the following command: <br/>
`mongoimport --db tripset --collection profiles --drop --file admin.json --jsonArray`

This command will delete all the data contained in the **"profiles"** collection and add only one **Admin** account.
This account does not have any particular privilege but will allow you to test the login system without having to create an account, as well as pre-filled data for the **Profile page**.
If the database and the collection have not been created yet, don't worry, this command will take care of it! 🤩 

To use this account: <br/>
**login:** admin@gmail.com <br/>
**password:** Admin 


## Step Four
Type `npm start`  and enjoy our website!

<br/>
<br/>

-- **Tripset team**                           
                                              


