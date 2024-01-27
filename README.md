
# LMS Frontend


### Setupt intruction 

1. Clone the project 

```
    git clone https://github.com/AMANULLAH023HY/LMS.git
```
2. Move into the directory 

```
    cd client
```
3. Install dependencies 

```
   npm i 
```
4. run the server

```
    npm run dev
```
### Setup intruction for tailwind 

```
    [Tailwind official intructions doc](https://tailwindcss.com/docs/installation)
```
1. Install tailwind css 

```
     npm install -D tailwindcss
```
2. Create tailwind config file 

```
    npx tailwindcss init
```
3.  Add file extension to tailwind config file in the content property

```
    "./src/**/*.{html,js,jsx,ts,tsx}"
```

4. Add the tailwind directives at the top of the `index.css` file 

```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
```
