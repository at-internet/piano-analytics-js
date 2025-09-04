<div id="top"></div>

<br />
<div align="center">
    <h1 align="center">Piano Analytics SDK JavaScript</h1>

</div>

<!-- ABOUT THE PROJECT -->
## About The Project


The Piano Analytics Javascript SDK allows you to collect audience measurement data for the [Piano Analytics](https://piano.io/product/analytics/) solution.
It works on all javascript environments dedicated to browsers (mostly websites).

This SDK makes the implementation of Piano Analytics as simple as possible, while keeping all the flexibility of the solution. By loading this small library on your platform, and using [dedicated and documented methods](https://developers.atinternet-solutions.com/piano-analytics/), you will be able to send powerful events.

It also includes [Consent management methods](https://developers.atinternet-solutions.com/piano-analytics/data-collection/how-to-send-events/consent) that allow you a perfect management of your tagging depending on the regulation you refer to.


<!-- GETTING STARTED -->
## Getting Started

- Install our library on your project (see below), you have a few possibilities :
    - Using NPM
    - Using our CDN (browser only)
  - Cloning the GitHub project to build a file you will host (browser only)
    - You can use this method if you want to configure your library without additional tagging (ex: like having your site and collect domain already configured in the built file). However, we suggest the NPM method if you use Build Tools (webpack etc.) 
- Check the <a href="https://developers.atinternet-solutions.com/piano-analytics/"><strong>documentation</strong></a> for an overview of the functionalities and code examples

## Using NPM

1. install our library
    ```sh
    npm install piano-analytics-js --save (--legacy-peer-deps)
    or
    yarn add piano-analytics-js
    ```

2. Configure your site and collect domain in your site/application initialization
    ```js
    import {pianoAnalytics} from 'piano-analytics-js';
    // for commonJS environment you can do the following
    // const pianoAnalytics = require('piano-analytics-js').pianoAnalytics;
   
   
   // in your initialization
    pianoAnalytics.setConfigurations({
        'site': 123456789,
        'collectDomain': 'https://<xxxxxxx>.pa-cd.com'
    });
    ```

3. Send events ! 
    ```js
    pianoAnalytics.sendEvent('page.display', // Event name
        {
            'page': 'page name', // Event properties
            'page_chapter1': 'level 1' ,
            'page_chapter2': 'level 2' ,
            'page_chapter3': 'level 3'
        }
    ); 
    ```
<p align="right">(<a href="#top">back to top</a>)</p>

## Using the CDN (browser)

1. Load the file from our CDN and configure your site and collect domain
    ```html
    <head>
        <script src="https://tag.aticdn.net/piano-analytics.js"></script>
        <script type="text/javascript">
            pa.setConfigurations({
                site:123456789, 
                collectDomain:'https://<xxxxxxx>.pa-cd.com'
            }); 
        </script>
    </head>
    ```
2. Send events
   ```html
   <body>
    <script type="text/javascript">
        pa.sendEvent('page.display', // Event name
            {
               'page': 'page name', // Event properties
               'page_chapter1': 'level 1' ,
               'page_chapter2': 'level 2' ,
               'page_chapter3': 'level 3'
            }
        ); 
    </script>
   </body>
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

## Using GitHub (browser)

1. Clone the repo
   ```sh
   git clone https://github.com/at-internet/piano-analytics-js
   ```
2. Install NPM packages
   ```sh
   npm install --legacy-peer-deps
   or
   yarn install
   ```
3. Enter your site and collect domain in `src/config.js` (optionnal if you want to do it in your implementation)
   ```
    'site': 123456789,
    'collectDomain': 'https://<xxxxxxx>.pa-cd.com'
   ```
4. Build the file
      ```sh
      npm run build
      ```


5. Get `piano-analytics.js` in `/dist/browser/` 
6. Load it and send events
```html
    <head>
        <script src="https://url-to-your-file/piano-analytics.js"></script>
    </head>
    <body>
        <script type="text/javascript">
            pa.sendEvent('page.display', // Event name
                {
                    'page': 'page name', // Event properties
                    'page_chapter1': 'level 1' ,
                    'page_chapter2': 'level 2' ,
                    'page_chapter3': 'level 3'
                }
            );
        </script>
    </body>
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

_For more examples, please refer to the [Documentation](https://developers.atinternet-solutions.com/piano-analytics/)_

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- DEBUGGING -->
## Debugging 

If you think there is a bug and are in a development environment, you can build the SDK without it being uglified using the following npm script
```sh
npm run rollup:browser
```
Also, quoting code using this will help us understand your issue
<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Please do not hesitate to contribute by using this github project, we will look at any merge request or issue. 
Note that we will always close merge request when accepting (or refusing) it as any modification has to be done from our side exclusively (so we will be the ones to implement your merge request if we consider it useful).
Also, it is possible that issues and requests from GitHub may take longer for us to process as we have dedicated support tools for our customers. So we suggest that you use GitHub tools for technical purposes only :)



<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

AtInternet a Piano Company - support@atinternet.com

<p align="right">(<a href="#top">back to top</a>)</p>






