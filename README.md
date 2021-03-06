# About *n4translate*
The web application *n4translate* helps software companies to manage the i18n translations of multiple Angular applications. 

When localizing custom software, customers often want to provide the translations for their application by themselves or have translation companies providing it. In this situation, *n4translate* helps the software manufacturer to manage the translations of multiple of his software projects for different customers. 

## User roles

The administrators that are usually part of the software manufacturer have the possibility to:
- create new projects
- add/edit users and give them access to projects
- import existing translations for a project, and export them after the translation took place
- add new "target languages" per software project, i.e. languages into which the software can be translated.

Normal users, the translators, can search for enter new and edit existing translations.

# Screenshot
The following screenshot shows how the administrator sees a project:
![n4translate-screenshot](/docs/n4translate-screenshot.png?raw=true "The admin's view of a project")

# Installation and setup
## Client configuration
### [Setting production apiUrl into production environment](https://github.com/n4group/n4translate/blob/master/client/src/environments/environment.prod.ts)

## Server configuration
### [Insert default user into DB](https://github.com/n4group/n4translate/tree/master/server)
Create a file 'default.user.json' with content similar to 'default.user.example.json', so a initial user can be created on an initial deploy.

## Deployment
- go to [client](https://github.com/n4group/n4translate/tree/master/client) - execute 'ng build --prod --aot'
- [deploy generated app](https://github.com/n4group/n4translate/tree/master/client) - execute 'node index.js'
- go to [server](https://github.com/n4group/n4translate/tree/master/server) - execute 'npm start prod'
