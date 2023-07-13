var actualLang = function() {
    var lang = document.querySelector('html').getAttribute('lang').slice(-2);
    return lang;      
}

  
  function gettypedRegions(actualLang) {
    var regions = [{name :  "Americas"}, {name :  "Africa"},{name :  "Asia"},{name :  "Europe"}, {name :  "Oceania"}];
    
        fetch(`rest/allCountries.json`)
        .then(r => r.json())
        .then(r => {
            renderTypedElements(r);
        })
    
    function renderTypedElements(r) {
        regions.map( (regionName, index) => {
            var textArray = r.filter( item => item.region === regionName.name); 
            var textArrayName = textArray.map( item => {
                
                if(actualLang === 'BR') {
                    return item.translations.br;
                } else if (actualLang === 'ES'){
                    return item.translations.es;
                } else {
                    return item.name;
                }
            });
            var typedElement = '#typed'+regionName.name;
            var typedComponent = new Typed(typedElement, {
                strings: textArrayName,
                typeSpeed: 40,
                backSpeed: 40,
                backDelay: 3000,
                startDelay: 1000,
                shuffle: true,
                loop: true,
            });
        });
    }
}
gettypedRegions(actualLang);


    const vm = new Vue({
      el: "#mapRender",
      data: {
        countries: [],
        COUNTRY: 'Spain',
        OPACITY: 0.25,
        lang: 'US',
        coordinatesPointOfView: {
          lat: 40.4168, 
          lng: -3.7038, 
          altitude: 1.5
        },
        countryOrigin: [],
        countryDebt: [],
        countryOriginName: '',
        countryDebtName: '',
        setCountry: false,
        fetchedOrigin: false,
        fetchedDebt: false,
        myGlobe: null,
        modalCountries: false,
      },
      filters: {
        printName(country) {
          //console.log(country);
          if(lang === 'BR') {
            return country.translations.br;
          } else if (lang === 'ES'){
            return country.translations.es;
          } else {
            return country.name;
          }
        },
        printLocale(value) {
          if(lang === 'BR') {
            return value.toLocaleString('pt-BR');
          } else if (lang === 'ES'){
            return value.toLocaleString('es-ES')
          } else {
            return value.toLocaleString('en-US')
          }
        }
      },
      methods: {
        fetchCountries() {
          //fetch(`https://restcountries.eu/rest/v2/all`)
          fetch(`rest/allCountries.json`)
            .then(r => r.json())
            .then(r => {
              this.countries = r;
            })
        },
        fetchCountryOrigin(name) {
          //fetch(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
          fetch(`rest/allCountries.json`)
            .then(r => r.json())
            .then(r => {
              //this.countryOrigin = r;
              this.countryOrigin = r.filter( fItem => fItem.name === name);
              console.log(this.countryOrigin);
              this.fetchedOrigin = true;
            })
        },
        fetchCountryDebt(name) {
          //fetch(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
          fetch(`rest/allCountries.json`)
            .then(r => r.json())
            .then(r => {
              //this.countryDebt = r;
              
              this.countryDebt = r.filter( fItem => fItem.name === name);
              this.fetchedDebt = true;
            })
        },
        setLanguage() {
          lang = document.querySelector('html').getAttribute('lang').slice(-2);
          console.log(lang);
          return lang;
        },
        findConsultant() {
          console.log('Entrou');
          
          console.log(`Country origin name: ${this.countryOriginName}`);
          console.log(`Country debt name: ${this.countryDebtName}`);
          

          this.countryOrigin = this.fetchCountryOrigin(this.countryOriginName);
          this.countryDebt = this.fetchCountryDebt(this.countryDebtName);

          //console.log(this.countryDebt[0]);

          this.setCountry = true;
          this.modalCountries = true,
          
          this.COUNTRY = this.countryDebtName;
          console.log(`COUNTRY: ${this.COUNTRY}`);

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          })

        
        
        },
        closeModalCountries({ target, currentTarget }) {
          if (target === currentTarget) this.modalCountries = false;
          this.myGlobe.pointOfView(this.coordinatesPointOfView, 800);
        },        
        renderGlobe() {
            this.myGlobe = Globe()
            (document.getElementById('globeViz'))
        
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
            .pointOfView(this.coordinatesPointOfView) // aim at continental US centroid
        
            .arcLabel(d => `${d.airline}: ${d.srcIata} &#8594; ${d.dstIata}`)
            .arcStartLat(d => +d.srcAirport.lat)
            .arcStartLng(d => +d.srcAirport.lng)
            .arcEndLat(d => +d.dstAirport.lat)
            .arcEndLng(d => +d.dstAirport.lng)
            .arcDashLength(0.25)
            .arcDashGap(1)
            .arcDashInitialGap(() => Math.random())
            .arcDashAnimateTime(4000)
            .arcColor(d => [`rgba(0, 255, 0, ${this.OPACITY})`, `rgba(255, 0, 0, ${this.OPACITY})`])
            .arcsTransitionDuration(0)
        
            .pointColor(() => 'orange')
            .pointAltitude(0)
            .pointRadius(0.02)
            .pointsMerge(true);

            console.log(this.myGlobe);

            this.fetchAirports();

            this.myGlobe.controls().autoRotate = true;
            this.myGlobe.controls().autoRotateSpeed = 1.5;
            this.animate();
        },
        fetchAirports() {
            airportParse = ([airportId, name, city, country, iata, icao, lat, lng, alt, timezone, dst, tz, type, source]) => ({ airportId, name, city, country, iata, icao, lat, lng, alt, timezone, dst, tz, type, source });
            routeParse = ([airline, airlineId, srcIata, srcAirportId, dstIata, dstAirportId, codeshare, stops, equipment]) => ({ airline, airlineId, srcIata, srcAirportId, dstIata, dstAirportId, codeshare, stops, equipment});
            Promise.all([
                fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat').then(res => res.text())
                    .then(d => d3.csvParseRows(d, airportParse)),
                fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat').then(res => res.text())
                    .then(d => d3.csvParseRows(d, routeParse))
                ]).then(([airports, routes]) => {
            
                const byIata = indexBy(airports, 'iata', false);

                //console.log(byIata);
            
                  /*
                const filteredRoutes = routes
                    .filter(d => byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata)) // exclude unknown airports
                    .filter(d => d.stops === '0') // non-stop flights only
                    .map(d => Object.assign(d, {
                    srcAirport: byIata[d.srcIata],
                    dstAirport: byIata[d.dstIata]
                    }))
                    .filter(d => d.srcAirport.country === this.COUNTRY && d.dstAirport.country !== this.COUNTRY); // international routes from country
            */
            const filteredRoutes = routes
                    .filter(d => byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata))
                    .map(d => Object.assign(d, {
                      srcAirport: byIata[d.srcIata],
                      dstAirport: byIata[d.dstIata]
                    })).filter(d => d.srcAirport.country === this.COUNTRY );

                /*
                this.myGlobe
                    .pointsData(airports)
                    .arcsData(filteredRoutes);
                */
                this.myGlobe.arcsData(filteredRoutes);

                
            });
        },
        animate() {
            this.myGlobe.renderer(scene);
            console.log('render animate');
            //console.log(myGlobe.renderer(scene));
            this.myGlobe.controls().update();
            //resizeCanvasToDisplaySize();
            requestAnimationFrame(this.animate);
        },
        globeResized() {
          const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
          }
          //Update sizes
          sizes.width = window.innerWidth;
          sizes.height = window.innerHeight;
          
          
          //Update camera
          this.myGlobe.camera().aspect = sizes.width / sizes.height;
          this.myGlobe.camera().updateProjectionMatrix();
    
          this.myGlobe.pointOfView(this.coordinatesPointOfView);
    
          const canvasMap = document.querySelector('.hero--map canvas');
    
          canvasMap.style.width = sizes.width + 'px';
          canvasMap.style.height = sizes.height + 'px';
         
    
          //Update renderer
          //myGlobe.renderer(scene).setSize(sizes.width, sizes.height);
          this.myGlobe.width = sizes.width;
          this.myGlobe.height = sizes.height;
          //renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          this.myGlobe.renderer(scene).setPixelRatio(Math.min(window.devicePixelRatio, 2));
        },
      },
      
      watch: {
        countryDebt: function() {
          console.log('Mutou debt');
          this.coordinatesPointOfView = {
            lat: this.countryDebt[0].latlng[0], 
            lng: this.countryDebt[0].latlng[1], 
            altitude: 1.5
            };
          console.log(this.coordinatesPointOfView);
          this.fetchAirports();
          this.myGlobe.pointOfView(this.coordinatesPointOfView, 800);
        }
      },
      created() {
        window.addEventListener("resize", this.globeResized);
      },
      mounted() {
        this.fetchCountries();
        this.setLanguage();
        
        this.renderGlobe();
      }
    });




    