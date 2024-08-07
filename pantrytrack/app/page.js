"use client";

import { Box, Stack, Typography } from "@mui/material";
import { firebase } from '@/firebase';
import { collection, query, getDocs } from "firebase/firestore";
import { useEffect } from "react";

const item = [
  'tomato',
  'onion',
  'potato',
  'carrot',
  'apple',
  'banana',
  'orange',
  'milk',
  'bread',
  'butter',
  'cheese',
  'egg',
  'chicken',
  'beef',
  'pork',
  'fish',
  'rice',
  'pasta',
  'flour',
  'kale',
  'spinach',
  'lettuce',
  'cabbage',
  'broccoli',
  'cauliflower',
  'asparagus',
  'zucchini',
  'green bean',
  'corn',
  'pea',
  'oil',
  'vinegar',
  'soy sauce',
  'ketchup',
  'mustard',
  'mayonnaise',
  'chili sauce',
  'curry paste',
  'curry powder',
  'cumin',
  'coriander',
  'cinnamon',
  'nutmeg',
  'ginger',
  'garlic',
  'chili',
  'basil',
  'oregano',
  'parsley',
  'rosemary',
  'thyme',
  'bay leaf',
  'lemon',
  'lime',
  'orange',
  'grapefruit',
  'watermelon',
  'strawberry',
  'blueberry',
  'raspberry',
  'blackberry',
  'kiwi',
  'salt',
  'pepper',
  'tofu',
  'scallion',
  'mushroom',
  'hot sauce',
  'sour cream',
  'yogurt',
  'cream',
  'ice cream',
  'chocolate',
  'candy',
  'cookie',
  'cake',
  'pie',
  'pudding',
  'jelly',
  'jam',
  'honey',
  'syrup',
  'tea',
  'coffee',
  'juice',
  'soda',
  'wine',
  'beer',
  'whiskey',
  'vodka',
  'rum',
  'gin',
  'tequila',
  'brandy',
  'liqueur',
  'vermouth',
  'bitters',
  'sake',
  'soju',
  'lamb',
  'duck',
  'turkey',
  'sausage',
  'bacon',
  'ham',
  'salami',
  'pepperoni',
  'prosciutto',
  'pancetta',
  'chorizo',
  'salmon',
  'tuna',
  'sardine',
  'anchovy',
  'shrimp',
  'lobster',
  'crab',
  'scallop',
  'clam',
  'mussel',
  'oyster',
  'squid',
  'octopus',
  'cuttlefish',
  'cod',
  'haddock',
  'saffron',
  'vanilla',
  'cocoa',
  'coconut',
  'almond',
  'cashew',
  'peanut',
  'walnut',
  'pecan',
  'pistachio',
  'macadamia',
  'hazelnut',
  'chestnut',
  'pine nut',
  'sunflower seed',
  'pumpkin seed',
  'sesame seed',
  'flaxseed',
  'chia seed',
  'quinoa',
  'bulgur',
  'barley',
  'oat',
  'wheat',
  'corn',
  'red onion',
  'white onion',
  'yellow onion',
  'green onion',
  'red potato',
  'white potato',
  'sweet potato',
  'russet potato',
  'yukon gold potato',
  'red bell pepper',
  'green bell pepper',
  'yellow bell pepper',
  'orange bell pepper',
  'red chili pepper',
  'green chili pepper',
  'yellow chili pepper',
  'orange chili pepper',
  'jalapeno',
  'habanero',
  'poblano',
  'serrano',
  'cayenne',
  'chili pepper',
  'banana pepper',
  'cheese',
  'cheddar',
  'swiss',
  'mozzarella',
  'parmesan',
  'provolone',
  'gouda',
  'brie',
  'camembert',
  'blue cheese',
  'feta',
  'goat cheese',
  'cream cheese',
  'ricotta',
  'cottage cheese',
  'butter',
  'salted butter',
  'unsalted butter',
  'margarine',
  'olive oil',
  'vegetable oil',
  'canola oil',
  'coconut oil',
  'peanut oil',
  'sesame oil',
  'avocado oil',
  'sunflower oil',
  'grapeseed oil',
  'flaxseed oil',
  'walnut oil',
  'palm oil',
  'lard',
  'baking soda',
  'baking powder',
  'yeast',
  'sugar',
  'granulated sugar',
  'brown sugar',
  'powdered sugar',
  'honey',
  'molasses',
  'corn syrup',
  'maple syrup',
  'agave syrup',
  'vanilla extract',
  'almond extract',
  'lemon extract',
  'orange extract',
  'rose water',
  'coconut milk',
  'almond milk',
  'soy milk',
  'rice milk',
  'oat milk',
  'cashew milk',
  'coconut water',
  'orange juice',
  'apple juice',
  'grape juice',
  'cranberry juice',
  'pineapple juice',
  'tomato juice',
  'lemonade',
  'iced tea',
  'cola',
  'root beer',
  'ginger ale',
  'lemon-lime soda',
  'orange soda',
  'grape soda',
  'cream soda',
  'tonic water',
  'club soda',
  'seltzer water',
  'sparkling water',
  'red wine',
  'white wine',
  'rose wine',
  'sparkling wine',
  'champagne',
  'beer',
  'lager',
  'ale',
  'stout',
  'pilsner',
  'porter',
  'ipa',
  'saison',
  'wheat beer',
  'pale ale',
  'pale lager',
  'amber ale',
  'brown ale',
  'scotch ale',
  'belgian ale', 
]
export default function Home() {
  useEffect(() => {
    const updatePantry = async () => {
      const snapshot = query(collection(firebase, "pantry"));
      const docs = await getDocs(snapshot);
      docs.forEach((doc) => {
        console.log(doc.id, doc.data());
      })
    }
    updatePantry();
  }, [])

  return (
    <Box
      width= "100vw"
      height= "100vh"
      display= {"flex"}
      justifyContent= {"center"}
      flexDirection={"column"}
      alignItems= {"center"}
    >
      <Box border={'1px solid #333'}>
        <Box 
        width= "800px" 
        heigth ="100px" 
        bgcolor={'#ADD8E6'} 
        display={"flex"}
        justifyContent={'center'}
        alignItems={'center'} 
        > 
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Inventory
          </Typography>
        </Box>
        <Stack width= "800px" height= "300px" spacing={2} overflow={'auto'}>
          {item.map((item) => (
            <Box
              key={item}
              width= "100%"
              height= "300px"
              display= {"flex"}
              justifyContent= {"center"}
              alignItems= {"center"}
              bgcolor= {"#f5f5f5"}
              borderRadius= {"5px"}
            >
              <Typography
              variant= {"h3"}
              color= {"#333"}
              textAlign= {"center"}
              >
                {
                  //capitalize the first letter of each word
                  item.charAt(0).toUpperCase() + item.slice(1)
                }
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
