# Grouping imagenet labels

The imagenet class hierarchy can be confusing, especially when presented to the end user. For some things 
the classes are very detailed (e.g. over 100 different breeds of dogs), while for others they are
comparatively coarse (e.g. four different breeds of cats). This folder describes a **manual** effort 
in grouping the classes for the use within the game. The grouping was performed by one person only,
so you should expect some bias in the choices.

## Grouping process

### Generate a csv of the class hierarchy 

1. `wget https://gist.githubusercontent.com/mbostock/535395e279f5b83d732ea6e36932a9eb/raw/62863328f4841fce9452bc7e2f7b5e02b40f8f3d/mobilenet.json`

2. `python create_class_hierarchy_csv.py`

### Manually annotate the csv 

1. Add two columns to the CSV
    * **category** very coarse category (e.g. animal, vegetable, vehicle). A category name will be 
                       presented to the user when introducing the task.  
    * **grouped label** less coarse group (e.g. dog, cat). These labels will be presented to the user as a 
    possible answers to the task.

2. Go through the CSV and manually fill out the columns. Following guiding principles where used
   * Many classes are not interesting for the game (e.g. not well known, hard to find pictures for) Skip
     these and leave category and grouped label empty.
   * You can usually find a suitable category and grouped label name within one of the levels of the hiearchy.  
   * If a category would have less than three grouped labels, you can skip it and leave these
     rows empty.
     
Please see file imagenet_class_hierarchy.csv for the categories and grouped labels used in the game.

### Convert the CSV to JS

Run `python csv_to_json.py`

This will create a file `imagenetClasses.js` which contains two constants:

* **IMAGENET_CATEGORIES** maps categories to labels and classes, i.e. {category: {label: [classes]}}
* **IMAGENET_CLASSES** maps class indexes to the original imagenet class names, i.e. {class: name} 
   
### Copy the generated JS to public folder

Check that the generated code is what you expected. Then run `cp imagenetClasses.js ../public/scripts/types`. 
Avoided to automate this due to risks of code injections when automatically generating code.
