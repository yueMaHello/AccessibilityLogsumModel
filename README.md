# Accessibility Model 
This is a Nodejs web application using Arcgis Javascript API. It is developed based on Logsum Model. The difference is that this App shows the logsum of logsum value, and the map is not interactive. The data source is the same as the one in Logsum Model. The method of calculating logsum of logsum is provided by Cherry.
## Set Up
#### From Github:
1. If you haven't installed Nodejs on your computer, you need to download it and add it into PATH.
2. Download this folder
3. Browse to the root of the folder
4. Open the terminal/cmd and go to the root of the App './AccessibilityLogsumModel'. 
5. Type 'npm install'
6. Type 'npm intall express --save'
7. Type 'npm install http-errors --save'
8. Type 'npm install fs --save'
9. Put your csv data into './public/data' folder. Cherry can help with the data source. Finally, './data' folder should consist five other folders: './data/GS', './data/Other', './data/Otherpurpose', './data/PSE', and './data/Work'
10. Each CSV file must have the same format as the example data located in './public/dataExample/LosumElem_Ins.csv'. For element in row[0]column[0], it can be empty or some text.

#### From Lab Computer I
1. Browse to the root of the folder
2. Open the terminal/cmd and go to the root of the App './AccessibilityLogsumModel'. 
3. In the './public/data/' folder, all the data source is provided.

## Run
1. Use terminal/cmd to go to the root of the App './AccessibilityModel'. 
2. Type 'npm start'
2. Browse 'http://localhost:3037' or 'http://162.106.202.155:3037/'

## Use tips:
#### Where is the data source from:
All the logsum data set is generated by Cherry's python code. There is a folder storing in Computer I: 'C:\Users\tsengineer\Desktop\Logsum processing scripts'. The code inside can generate this app's data source.
#### If you want to update the dataset: 
All the logsum data set is provided by Cherry. If you just want to simply renew the dataset without changing the structure or name, you can replace csv files into new ones one by one. If you want to change the data structure, it's totally fine since the application will detect your data structure and update the UI. You could use a tree structure to define the data structure, and you should use meaningful dictionaries' name and csv files' names.
#### If you want to update the TravelZoneLayer shape file:
 1. The map layer is not stored in localhost. It is stored in the arcgis online server.
 2. In './public/javascript/main.js', you can find the current layer: 'https://services8.arcgis.com/FCQ1UtL7vfUUEwH7/arcgis/rest/services/newestTAZ/FeatureServer/0'. If you want to change it to another layer, you can create you own arcgis online account and upload the layer to the arcgis server. You need to replace the url into a new one. You can also ask Sandeep to access Yue Ma's arcgis account.
#### If you want to change the legend:
1. Open './public/javascripts/main.js' file, search 'readerer.addBreak' to show that part of code.
2. Right now, the break points all are calculated based on data of zone[101]. It can adjust the legend to suit different dataset. If you want to change the break points, you could just manually change 'sort[chunkZone]' to some specific value. 
      For exampe:
      * renderer.addBreak(0, 70, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([255, 255, 255,0.90])));
      * renderer.addBreak(70, 150, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0,0.1]),1)).setColor(new Color([249, 238, 237,0.90])));
#### If you want to change the legend color:
1. Open './public/javascripts/main.js' file, search 'readerer.addBreak' to show that part of code.
2. Change 'new Color([255, 255, 255,0.90])' to some other RGB color.
      
#### Woops, the App can't run after changing a new dataset:
 1. You need to restart the server from terminal/cmd (Rerun 'npm start').



