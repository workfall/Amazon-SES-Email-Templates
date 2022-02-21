const awsConfig = require('./config/aws');
const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const ses = new AWS.SES({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region,
});

app.get('/create', (req, res) => {
    createAmazonSESTemplate().then((response) => {
        res.send('Template Created Successfully!');
    });
});

app.get('/delete', (req, res) => {
    deleteExistingTemplate('AmazonSESTemplate').then((response) => {
        res.send('Template Deleted Successfully!');
    });
});

createAmazonSESTemplate = function () {
    return new Promise(async (resolve, reject) => {
        await this.deleteExistingTemplate('AmazonSESTemplate');
        const parameters = {
            Template: {
                TemplateName: 'AmazonSESTemplate',
                HtmlPart: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <title>EMAIL</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0;font-family: 'Poppins'">
                    <p>Hi {{userName}},</p>
                    <br>
                    <p>You have successfully received this email via Amazon Simple Email Service - SES.</p>                
                </body>

                </html>`,
                SubjectPart: 'SES Template',
            },
        };
        ses.createTemplate(parameters, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

deleteExistingTemplate = function (templateName) {
    return new Promise((resolve, reject) => {
        const parameters = {
            TemplateName: templateName,
        };
        ses.deleteTemplate(parameters, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});