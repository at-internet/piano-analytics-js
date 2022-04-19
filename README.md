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

It also includes [Privacy tagging methods](https://developers.atinternet-solutions.com/piano-analytics/data-collection/privacy) that allow you a perfect management of your tagging depending on the regulation you refer to.


<!-- GETTING STARTED -->
## Getting Started

- Install our library on your project (see below), you have two possibilities :
  - Using directly the GitHub project to generate a file you will have to host
  - Using our CDN
- Check the <a href="https://developers.atinternet-solutions.com/piano-analytics/"><strong>documentation</strong></a> for an overview of the functionalities and code examples

### Installation
Note that you can generate a file within your site with your site and collect domain already configured, which is not possible using our global CDN
#### Using GitHub
1. Clone the repo
   ```sh
   git clone https://github.com/at-internet/piano-analytics-js
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
   _Use the `--legacy-peer-deps` flag if you got peer dependencies errors from a recent npm version_
3. Enter your site and collect domain in `src/config.js` (optionnal if you want to do it in your implementation)
   ```js
    'site': 123456,
    'collectDomain': 'https://logsx.xiti.com',
   ```
4. Build the file
      ```sh
      npm run build
      ```
    _For the moment, a warning may appear saying `Creating a browser bundle that depends on "https"`. You may ignore this warning as the code using this dependency is excluded from the file generated for the browser bundle_
5. Get `piano-analytics.js` in `/dist/browser/`
6. Load it and send events
```html
    <head>
        <script src="https://my.website.com/piano-analytics.js"></script>
    </head>
    <body>
        <script type="text/javascript">
            pa.sendEvent('page.display', // Event name
                {
                    'page': 'page name', // Event properties
                    'page_chapter1': 'chapter 1' ,
                    'page_chapter2': 'chapter 2' ,
                    'page_chapter3': 'chapter 3'
                }
            );
        </script>
    </body>
```
#### Using the CDN
   
1. Load the file from our CDN and configure your site and collect domain
    ```html
    <head>
        <script src="https://tag.aticdn.net/piano-analytics.js"></script>
        <script type="text/javascript">
            pa.setConfigurations({
                site:123456, 
                collectDomain:'https://logsx.xiti.com'
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
               'page_chapter1': 'chapter 1' ,
               'page_chapter2': 'chapter 2' ,
               'page_chapter3': 'chapter 3'
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






