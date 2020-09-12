(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{71:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return l})),t.d(n,"metadata",(function(){return r})),t.d(n,"rightToc",(function(){return c})),t.d(n,"default",(function(){return p}));var i=t(2),a=t(6),o=(t(0),t(82)),l={id:"configuration",title:"Configuration"},r={unversionedId:"configuration",id:"configuration",isDocsHomePage:!1,title:"Configuration",description:"Configuration across web, mobile and apollo-sever-express follows CRA's environment variables. Configuration specific to cloud deployment is found in the Pulumi stack.",source:"@site/docs/configuration.md",slug:"/configuration",permalink:"/docs/configuration",editUrl:"https://github.com/tiagob/create-full-stack/edit/master/packages/docusaurus/docs/configuration.md",version:"current",sidebar:"someSidebar",previous:{title:"Available Scripts",permalink:"/docs/available_scripts"},next:{title:"Migrations",permalink:"/docs/migrations"}},c=[{value:"With Pulumi AWS",id:"with-pulumi-aws",children:[]}],b={rightToc:c};function p(e){var n=e.components,t=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(i.a)({},b,t,{components:n,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Configuration across web, mobile and apollo-sever-express follows CRA's ",Object(o.b)("a",Object(i.a)({parentName:"p"},{href:"https://create-react-app.dev/docs/adding-custom-environment-variables/"}),"environment variables"),". Configuration specific to cloud deployment is found in the ",Object(o.b)("a",Object(i.a)({parentName:"p"},{href:"https://www.pulumi.com/docs/intro/concepts/stack/"}),"Pulumi stack"),"."),Object(o.b)("p",null,"Create Full Stack loads environment variables from ",Object(o.b)("inlineCode",{parentName:"p"},".env")," files into ",Object(o.b)("inlineCode",{parentName:"p"},"process.env"),". Storing configuration in the environment separate from code is based on ",Object(o.b)("a",Object(i.a)({parentName:"p"},{href:"https://12factor.net/config"}),"The Twelve-Factor App methodology"),"."),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},".env")," files are in their corresponding platform packages directories. For instance, ",Object(o.b)("inlineCode",{parentName:"p"},"packages/web/.env.production")," or ",Object(o.b)("inlineCode",{parentName:"p"},"packages/mobile/.env.production"),"."),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},".env"),": Default."),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},".env.local"),": Local overrides. This file is loaded for all environments except test."),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},".env.development"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env.test"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env.production"),": Environment-specific settings."),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},".env.development.local"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env.test.local"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env.production.local"),": Local overrides of environment-specific settings.")),Object(o.b)("p",null,"Files on the left have more priority than files on the right:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"npm start"),": ",Object(o.b)("inlineCode",{parentName:"li"},".env.development.local"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env.development"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env.local"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"npm run build"),": ",Object(o.b)("inlineCode",{parentName:"li"},".env.production.local"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env.production"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env.local"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("inlineCode",{parentName:"li"},"npm test"),": ",Object(o.b)("inlineCode",{parentName:"li"},".env.test.local"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env.test"),", ",Object(o.b)("inlineCode",{parentName:"li"},".env")," (note ",Object(o.b)("inlineCode",{parentName:"li"},".env.local")," is missing)")),Object(o.b)("h2",{id:"with-pulumi-aws"},"With Pulumi AWS"),Object(o.b)("table",null,Object(o.b)("thead",{parentName:"table"},Object(o.b)("tr",{parentName:"thead"},Object(o.b)("th",Object(i.a)({parentName:"tr"},{align:null}),"production"),Object(o.b)("th",Object(i.a)({parentName:"tr"},{align:null}),"development"),Object(o.b)("th",Object(i.a)({parentName:"tr"},{align:null}),"test"))),Object(o.b)("tbody",{parentName:"table"},Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",Object(i.a)({parentName:"tr"},{align:null}),Object(o.b)("inlineCode",{parentName:"td"},"Pulumi.production.yml")," or ",Object(o.b)("inlineCode",{parentName:"td"},".env.production")),Object(o.b)("td",Object(i.a)({parentName:"tr"},{align:null}),Object(o.b)("inlineCode",{parentName:"td"},".env.development")),Object(o.b)("td",Object(i.a)({parentName:"tr"},{align:null}),Object(o.b)("inlineCode",{parentName:"td"},".env.test"))))),Object(o.b)("p",null,"Pulumi stack configuration is in the ",Object(o.b)("inlineCode",{parentName:"p"},"pulumi-aws")," package. For instance, ",Object(o.b)("inlineCode",{parentName:"p"},"packages/pulumi-aws/Pulumi.production.yml"),". If Auth0 is included, Auth0 local development configuration is included in the Pulumi stack ",Object(o.b)("inlineCode",{parentName:"p"},"Pulumi.development.yml")," since this exists in the cloud."),Object(o.b)("p",null,"Pulumi stacks shouldn't be confused with ",Object(o.b)("inlineCode",{parentName:"p"},"NODE_ENV"),". A ",Object(o.b)("inlineCode",{parentName:"p"},"NODE_ENV")," of production tells CRA and Node to set various optimizations (ex. minification) relevant for running on a server. ",Object(o.b)("inlineCode",{parentName:"p"},"NODE_ENV")," is used to determine which ",Object(o.b)("inlineCode",{parentName:"p"},".env")," files are loaded. Alternatively, Pulumi stacks can be seen as deployed environments (ex. production or staging). If you were to create a staging environment you'd have a ",Object(o.b)("inlineCode",{parentName:"p"},"Pulumi.staging.yml")," which would also load ",Object(o.b)("inlineCode",{parentName:"p"},".env.production"),"."))}p.isMDXComponent=!0}}]);