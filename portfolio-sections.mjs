// Portfolio content from supplied project material.
export const portfolioSections={
  "4": {
    "heading": "A room in isometric"
  },
  "5": {
    "heading": "My room during an exam period",
    "body": "My rented room can get chaotic during exams, and I decided to keep that in the model. The clutter was part of the story I wanted to tell about living and studying in a small space away from home."
  },
  "6": {
    "heading": "Modelling the building"
  },
  "7": {
    "heading": "An everyday object, taken apart"
  },
  "8": {
    "heading": "A structure shaped by waves"
  },
  "9": {
    "heading": "Working with paper",
    "body": "The starting point was a 25 × 25 cm sheet of paper. Folding and shaping it helped me explore a roof that feels continuous with the ground."
  },
  "10": {
    "heading": "From model to landscape"
  },
  "11": {
    "heading": "Reading the form"
  },
  "12": {
    "heading": "A staircase as a starting point"
  },
  "13": {
    "heading": "Translating an image into geometry"
  },
  "14": {
    "heading": "Parametric iterations"
  },
  "15": {
    "heading": "Assembling the BIM model"
  },
  "16": {
    "heading": "A mobile library for 2100"
  },
  "17": {
    "heading": "Imagining the future environment"
  },
  "18": {
    "heading": "Community, movement and shelter"
  },
  "19": {
    "heading": "Sharing what the community knows",
    "body": "I explored how the community could collect weather observations during their migrations and bring them together as shared knowledge. Placing lightweight tents within caves let me work with both the permanence of the cave and the mobility of nomadic life. The project became a way to think about future survival, and how architecture could help preserve essential knowledge without losing its connection to the community’s culture."
  },
  "20": {
    "heading": "Developing the spatial model"
  },
  "21": {
    "heading": "Spaces in section"
  },
  "22": {
    "heading": "Inside the archive"
  },
  "23": {
    "heading": "Architecture within the landscape"
  },
  "24": {
    "heading": "A vertical neighbourhood"
  },
  "25": {
    "heading": "Homes and public streets",
    "body": "I placed public sky streets between the residential floors, with separate lifts for visitors and residents. I wanted the shops and workshops to feel like one long street in the sky, while keeping the homes private. The building follows the river and steps back to reduce exposure to the western sun.",
    "items": [
      "Public levels: cafés, hawker stalls, workshops, shops and shared gardens.",
      "Residential levels: private homes with communal lounges, courtyards and gardens.",
      "Ground connections: community centre, pedestrian loop and waterfront walkway."
    ]
  },
  "26": {
    "heading": "Three ways to live and work",
    "body": "I used three modular unit types to make room for different households and ways of working.",
    "items": [
      "50 m² studio for singles, freelancers and solo creators.",
      "135 m² adaptable home and workshop for multigenerational families.",
      "100 m² shophouse for business owners."
    ]
  },
  "27": {
    "heading": "Separate lifts for homes and streets",
    "body": "I separated the lifts so visitors can move between the public streets without passing through the residential floors. Residents have their own lifts serving the homes in between."
  },
  "28": {
    "heading": "The neighbourhood as a whole"
  },
  "29": {
    "heading": "Arranging shops by the length of a visit",
    "body": "I placed bakeries and hawker stalls lower down for shorter visits. Workshops sit in the middle, where people might spend a few hours making or learning something. Restaurants and sky gardens at the top give visitors a reason to travel further up."
  },
  "30": {
    "heading": "Designing a 4.7 m bridge",
    "body": "We explored arched and wave shaped bridges before choosing a triangular cross section. Our earlier square frame needed diagonal bracing, which made the wire connections difficult to assemble. The triangle gave us a simpler way to stiffen the structure. We used timber for compression and threaded rods for tension, with the metal joints connecting the two."
  },
  "31": {
    "heading": "Building at full size",
    "body": "Over several weeks, we adjusted the bridge through consultations and testing. We then had three days to build it at full size, working through how the parts fitted together and how the materials behaved."
  },
  "32": {
    "heading": "Making the metal joints",
    "body": "I wanted the joints to contribute to the appearance of the bridge as well as hold it together. I drafted them as DXF files for laser cutting and added dashed fold lines to guide the bending from flat sheets into three dimensional pieces."
  },
  "33": {
    "heading": "Connections in the completed bridge",
    "body": "Each joint had to respond to a different angle along the bridge. We added bend guides and allowed space around the threaded rods so the nuts could be fitted and tightened during assembly. The completed bridge spanned 4.7 m, weighed 27.5 kg and deflected 0.6 cm under a 20 kg test load. The triangular frame helped structurally, but it also restricted the internal clearance: the hamster ball passed through, while the medicine ball did not. This showed us a tradeoff to address in a future iteration."
  },
  "35": {
    "heading": "Architectural drafting"
  },
  "36": {
    "heading": "Elevations and sections"
  },
  "37": {
    "heading": "Modelling and drawing"
  },
  "38": {
    "heading": "Pool studies and visualisation"
  },
  "39": {
    "heading": "Detail drawings"
  },
  "40": {
    "heading": "Observational studies"
  },
  "41": {
    "heading": "Painting and material studies"
  },
  "ribbon:12": {
    "heading": "From an imagined staircase to a model",
    "body": "The brief took inspiration from Piranesi’s Imaginary Prisons, with exaggerated perspectives and overlapping spaces. We began with AI images to explore that atmosphere, then worked out how to turn the idea into a staircase using Grasshopper, Rhino.Inside.Revit and D5 Render. The colourful render shows our original model; the line study and rainy view explore other ways of presenting it."
  },
  "ribbon:13": {
    "heading": "Generating the spiral paths",
    "body": "We started with a Python script inside Grasshopper to generate spiral curves. Inputs such as height, radius, turns and the number of steps let us vary their shape. Small changes in phase and radial offset gave each spiral a different path. We then extracted the boundary curves to use in the Revit staircase. The annotated Python script explains the logic behind these Grasshopper components."
  },
  "ribbon:14": {
    "heading": "Building the balustrades, rails and supports",
    "body": "Each definition develops a different part of the staircase. We moved points along the spiral paths and used controlled variations to shape the upper and lower balustrade edges, then lofted between them. A further curve became a handrail using a pipe with a 30 mm radius. For the supports, we divided the spirals and linked points back to a vertical centre line before turning the curves into pipes. Each row pairs the definition with its output."
  },
  "ribbon:15": {
    "heading": "Taking the staircase into Revit",
    "body": "We split the boundary curves across three levels to control the heights between floors. Further divisions defined the risers and staircase paths, which we passed into the Python script through Rhino.Inside.Revit. We assembled the BIM model in Revit and used D5 Render to explore lighting and materials. The project helped us understand how to keep a complex parametric model organised as it moves between different tools."
  },
  "a-bridge:fabrication": {
    "heading": "From cut plates to assembled parts",
    "body": "We laser cut the joint plates, then bent them by hand or with the bending machine, using the cut dash lines as guides. We fitted the joints to the timber members and checked the connections as we assembled the bridge. When the main timber connection needed more support, we added metal plates underneath and secured them with screws."
  },
  "weave:3": {
    "heading": "Weaving the route through the museum",
    "body": "I chose Tanabe Chikuunsai IV and Zhang Wang because of the contrast between their work. Taking inspiration from weaving, I wanted visitors to discover performances and artworks along the way, almost as if they were finding their way through a maze."
  },
  "weave:4": {
    "heading": "Keeping the path through the site",
    "body": "My site analysis showed that many people already walked across this route, so I kept a path beneath the building. I layered circular volumes to organise the museum, placing storage and design labs partly below ground and lifting the public spaces above. The café sits closer to the river to make use of the view."
  },
  "weave:5": {
    "heading": "Bringing light into the overlaps",
    "body": "Where the circles overlap, I introduced cylindrical light wells. I wanted these to do more than bring in daylight, so they also became spaces that visitors could walk through as they moved between the galleries."
  },
  "butterfly-effect:16": {
    "heading": "Form and fabrication",
    "body": "We explored the limits of CNC milling through a butterfly-inspired chair, using a sculpted surface to give the seat its character."
  },
  "butterfly-effect:inspiration": {
    "heading": "Looking at ripples and butterfly wings",
    "body": "We looked at patterns in nature, especially ripples, wave interference and butterfly wings. The overlapping waves gave us a starting point for the seat’s surface. We wanted to use CNC milling to make these intricate contours in wood, so people could experience the pattern through touch as well as sight."
  },
  "butterfly-effect:outcome": {
    "heading": "How the chair developed",
    "body": "We started with a conventional seat and frame, focusing on function. After consultations, we decided to try a more sculptural approach and make fuller use of CNC milling. We looked at ripples and butterfly wings for patterns that people could feel as well as see."
  },
  "butterfly-effect:form": {
    "heading": "Testing the surface and seat shape",
    "body": "We used Grasshopper to change the frequency, amplitude and starting points of the waves. This let us test different surfaces without shaping every contour by hand. After trying several outlines, we chose one that follows the contours of the seat, so the pattern continues into its edges."
  },
  "butterfly-effect:structure": {
    "heading": "Keeping the legs simple",
    "body": "The seat already had a lot of texture, so we kept the base simple. We tested the legs for stability and how they looked with the seat, then chose four tapered legs with a square connection at the bottom. Before making it, we used Rhino models and an exploded drawing to check the dimensions and assembly."
  },
  "butterfly-effect:making": {
    "heading": "Making the chair",
    "body": "We measured and cut the metal pieces, then used a machine to bend them to 90 degrees. We adjusted them by hand to reach the final 80-degree angle. At the same time, we milled the wooden seat using the CNC machine and assembled the metal frame."
  },
  "butterfly-effect:details": {
    "heading": "The finishing touches",
    "body": "We spray painted the metal frame black and coated the wooden seat with clear lacquer to bring out its natural texture. The finished chair brought the wave patterns we had tested on screen into something people could sit on and feel with their hands."
  },
  "flow:landscapes": {
    "heading": "Imagining the structure in a landscape",
    "body": "I wanted the roof to feel as though it rises out of the ground and invites people to walk over it. I later explored this as a visitor centre, with a small exhibition, café and sheltered places to rest beneath the roofs. These AI assisted views show it in meadow and winter settings."
  },
  "flow:paper": {
    "heading": "Working with paper",
    "body": "The brief started with a 25 × 25 cm sheet of paper. Cutting and shaping it helped me test how the ribbons could rise from the ground and create shelter beneath them. These process images have been enhanced with AI for presentation."
  },
  "flow:drawings": {
    "heading": "Developing the form",
    "body": "I tried several versions before choosing a slight asymmetry to reflect the irregularities found in nature. The model views and drawings show how the ribbons sit together and where they create space underneath. These presentation images have been enhanced with AI."
  },
  "flow:materials": {
    "heading": "Trying other materials and settings",
    "body": "I used AI assisted studies to imagine the form in timber and weathering steel. In the woodland setting, I explored a visitor centre with spaces for learning and reading. In the arid landscape, I tried it as a gallery and lookout."
  },
  "flow:urban-study": {
    "heading": "Trying a waterfront setting",
    "body": "For this AI assisted illustration, I imagined the form as a waterfront reading centre with an exhibition space and a small café terrace. I also tried a different way of presenting it, using fine lines and a limited palette."
  },
  "flow:landscape-view": {
    "heading": "Looking from above",
    "body": "This view shows how the planted ribbons could rise from the hillside and connect with the surrounding ground."
  },
  "art-studies:cityscapes": {
    "heading": "Places and spaces"
  },
  "art-studies:portraits-figures": {
    "heading": "Portraits and figures"
  },
  "art-studies:sketchbook": {
    "heading": "Sketchbook"
  },
  "art-studies:light-colour": {
    "heading": "Light and colour"
  },
  "art-studies:still-life": {
    "heading": "Still life"
  },
  "ascent:8": {
    "heading": "Starting with the site and client",
    "body": "The brief gave me a site, a client, and three shapes to work with: one square, one equilateral triangle and one circle. My client is a gardener and plant researcher who enjoys inviting her neighbours over. I used the existing slope to arrange her home, with the garden and shared spaces lower down and the private rooms higher up."
  },
  "ascent:sun": {
    "heading": "Planning around the morning sun",
    "body": "I placed the garden towards the east so her plants could receive the morning sun and she could begin the day gardening. The bedroom sits in a more private part of the plan, with less direct morning light so she can sleep in. I arranged the square, triangle and circle around these routines, using the slope to move gradually from shared spaces to private ones."
  },
  "ascent:9": {
    "heading": "A gradual ascent from public to private",
    "body": "I used the slope to organise the house from its more public spaces to its private ones. The entrance and garden sit on the lower ground, followed by the living area where she can welcome her neighbours. As she moves further up, the house becomes more private, leading to the bedroom and resting spaces. At the top, a skydoor and retractable staircase open onto the roof, giving her a quiet retreat outdoors."
  },
  "ascent:10": {
    "heading": "Everyday life across the levels",
    "body": "The lower sitting area gives her somewhere to welcome neighbours, while the dining space sits a few steps higher. The model and interior study show how the level change connects these shared spaces and makes the gradual ascent part of everyday life."
  },
  "ascent:11": {
    "heading": "Imagining the house in winter",
    "body": "This seasonal study explores the same house in winter, contrasting the planted roof terraces with snow and warm light from the rooms below."
  },
  "venture:8": {
    "heading": "A place for art and quiet",
    "body": "I imagined a small exhibition space where people could take their time with a few artworks. The pieces are spaced apart so the light, the cliff and the pauses between them remain part of the experience. These updated AI assisted renders explore this use of the original design."
  },
  "venture:9": {
    "heading": "Tapering the form to bring in light",
    "body": "I began with a rectangle and tapered the form so parts of it would reach through the top of the cliff. This was intentional: when I used Boolean difference to subtract the form from the cliff, it would create openings above as well as the interior spaces. I wanted these openings to bring daylight into the deeper parts of the cliff, creating brighter areas for viewing artworks alongside darker, quieter spaces for meditation."
  },
  "venture:10": {
    "heading": "Moving between art and stillness",
    "body": "I wanted the light to change as people moved through the space. A dim entrance route opens into a brighter area for viewing artworks. Further inside, a quieter meditation space offers somewhere to pause away from the exhibition. A few pieces sit along the route, leaving room to move and spend time alone."
  },
  "venture:11": {
    "heading": "Returning to the light",
    "body": "After the darker, quieter spaces, the route opens into daylight again. I imagined this as a final exhibition space where people could linger before looking back out towards the landscape. Steps connect the different floor levels so the journey can continue through the space."
  },
  "pause:32": {
    "heading": "A pavilion around a living tree"
  },
  "pause:33": {
    "heading": "Letting in light and air",
    "body": "I used vertical louvers and a perforated roof to let light and air through while maintaining privacy. With the tree at the centre, I wanted this everyday stop to offer a brief moment of stillness and a connection to the outdoors."
  },
  "the-wandering-archive:16": {
    "heading": "What knowledge should endure?",
    "body": "What knowledge is worth carrying when you cannot keep everything? I imagined a community collecting weather observations as it travels, preserving what might help someone survive the next journey."
  },
  "the-wandering-archive:17": {
    "heading": "The library they carried",
    "body": "Our studio developed a shared future timeline, bringing together different projects within the same world. My own narrative follows Mongolian nomads whose grasslands become increasingly difficult to inhabit. After being rehoused in tightly controlled cities, some return to movement. Their old migration routes no longer hold, so they collect rainfall shifts, soil changes, seed viability and other observations to help plan their next journey. As the collection grows beyond what they can carry, they leave archives at strategic sites, forming a network around a main library. The cave environments show the setting I developed for this proposal."
  },
  "the-wandering-archive:18": {
    "heading": "From observations to shared knowledge",
    "body": "The main library stays in one place, while smaller mobile libraries gather local climate data and engage with communities. Information comes from sensors, observation, satellites and informal discussions with local people. It is then selected, condensed and engraved onto quartz shards, prioritising knowledge that helps people survive changing conditions. Visitors can browse the archive, request a copy of a dataset or contribute their own observations in the discussion circle. I organised the public spaces around reading, exchange and collective memory."
  },
  "the-wandering-archive:19": {
    "heading": "Reading the cave through analysis",
    "body": "I studied Devetashka Cave as a typology and tested the modelled site.",
    "items": [
      "Solar radiation: locate sunlit gathering areas and shaded archives.",
      "Flat surfaces: identify possible platforms and attachments."
    ]
  },
  "the-wandering-archive:20": {
    "heading": "Giving the information a route",
    "body": "Purple collection spaces feed into blue processing areas and orange public rooms. Mesh bridges connect the workspaces, allowing librarians to carry records between selection, engraving and checking. The routes also provide places to pause and exchange ideas."
  },
  "the-wandering-archive:21": {
    "heading": "The library in plan and section",
    "body": "The section, plan and aerial view show how the rooms, bridges and canopies fit within the cave. I kept the larger communal spaces connected while giving the working areas their own routes between levels."
  },
  "the-wandering-archive:22": {
    "heading": "Reading, checking and exchanging",
    "body": "The interior views follow the collection into the reading chamber, archive and quartz display. Visitors can browse records, request a copy of a dataset or share observations in the discussion circle."
  },
  "the-wandering-archive:23": {
    "heading": "A place to return to",
    "body": "The cave is a permanent place to return to, while smaller libraries carry knowledge between communities. Each journey adds something to the archive and takes something useful away."
  },
  "the-wandering-archive:studio": {
    "heading": "A shared future, different responses",
    "body": "",
    "items": [
      "Shared studio timeline: a collective imagined future.",
      "My highlighted proposal: nomads collecting and sharing climate observations."
    ]
  },
  "the-wandering-archive:narrative": {
    "heading": "Leaving the cities, returning to movement",
    "body": "In my imagined future, the grasslands begin to fail in the 2050s. Longer summers and harsher winters force nomadic communities into cities. The housing is meant to be temporary, but the weather never settles.",
    "items": [
      "2063–2075 · Life in the cities: Platform-n tracks daily resource use. Some people adapt, but others find the routines too rigid.",
      "2073–2075 · Remembering: stories of travelling with the seasons begin to feel like possibilities again.",
      "2076–2078 · Returning to movement: small groups leave with portable technology and collapsible shelters. They travel light, trade and repair rather than replace."
    ]
  },
  "the-wandering-archive:personal-timeline": {
    "heading": "How the wandering archive begins",
    "body": "From 2078, weather observations become a travelling library, with archives left along migration routes."
  },
  "the-wandering-archive:community": {
    "heading": "Why Mongolian nomads?",
    "body": "I chose Mongolian nomads for their existing relationship with the land.",
    "items": [
      "Seasonal knowledge of weather, land and ecology.",
      "Oral traditions and collective memory.",
      "A library shaped around movement and shared experience."
    ]
  },
  "the-wandering-archive:quartz": {
    "heading": "Quartz as a store of knowledge",
    "body": "",
    "items": [
      "Durable quartz glass holds the records.",
      "Laser writing; specialised optical reading.",
      "Limited carrying capacity makes selection essential."
    ]
  },
  "the-wandering-archive:weather-research": {
    "heading": "Learning from OpenWeather",
    "body": "OpenWeather helped me structure the information cycle.",
    "items": [
      "Acquire and organise weather observations.",
      "Filter and interpret the data.",
      "Make useful information available for the next journey."
    ]
  },
  "the-wandering-archive:data-flow": {
    "heading": "How the archive works",
    "body": "Sensors, observations and satellites supply raw data. Librarians sort and select it before engraving useful records onto quartz. Reading and transcription make those records accessible again, while discussions bring local knowledge back into the collection. The diagram follows this cycle from observation to shared knowledge."
  },
  "the-wandering-archive:users": {
    "heading": "Three roles within the archive",
    "body": "",
    "items": [
      "Data technician: sorts and selects incoming records.",
      "Archivist: transcribes, tags and stores quartz; gathers oral knowledge.",
      "Visitor: reads datasets, browses the archive and shares observations."
    ]
  },
  "the-wandering-archive:blender-site": {
    "heading": "Building the cave in Blender",
    "body": "Blender studies of the cave’s openings and terrain, before placing the library."
  },
  "the-wandering-archive:unreal-site": {
    "heading": "Exploring the landscape in Unreal Engine",
    "body": "Three Unreal Engine views explore vegetation and daylight, from the exposed landscape to the sheltered cave."
  },
  "the-wandering-archive:site-model": {
    "heading": "Testing the cave as a physical model",
    "body": "A physical study of the cave’s enclosure and openings."
  },
  "the-wandering-archive:selected-site": {
    "heading": "Choosing the cave entrance",
    "body": "I selected a 42 m cube near the cave entrance, where visitors can reach the library without travelling deep inside. The position brings daylight to the arrival spaces and connects the sheltered archive with the landscape beyond."
  },
  "the-wandering-archive:programmes": {
    "heading": "Turning the data cycle into spaces",
    "body": "",
    "items": [
      "Public: reading, archive and discussion.",
      "Processing: data selection and engraving.",
      "Collection: observation and quality control."
    ]
  },
  "the-wandering-archive:physical-model": {
    "heading": "Bringing the library into a physical model",
    "body": "The final model brings the solid rooms and lightweight canopies together, showing how a permanent archive can retain the character of portable shelters."
  },
  "the-wandering-archive:massing": {
    "heading": "Fitting rooms and shelters into the rock",
    "body": "I adjusted the programme volumes to the cave’s contours and flatter surfaces. Tent-like canopies recall the community’s temporary shelters: smaller ones cover reading and discussion areas, while the larger canopy gathers the communal spaces beneath it."
  },
  "stacked-streets:24": {
    "heading": "Bringing the street upwards",
    "body": "My response is a vertical neighbourhood with public sky streets between residential floors. This brings the everyday encounters of a shophouse street into a denser building, while retaining a quieter route home. The following plans, unit studies and sections show how I developed that separation and the connections between living, working and shared space."
  },
  "stacked-streets:25": {
    "heading": "Developing the building form",
    "body": "I arranged the homes as a repeated system, then opened up shared levels between them. The aggregation study shows how the units build up, while the axonometric brings the streets, voids and residential floors together. This establishes the overall form before looking at how people move through it."
  },
  "stacked-streets:26": {
    "heading": "Three ways to live and work",
    "body": "With the public and private levels established, I developed three unit types for the different users. The 50 m² studio accommodates singles, freelancers and solo creators. A 135 m² home and workshop supports multigenerational households combining family life and making. The 100 m² shophouse brings a business and home together. The distribution diagram shows the mix, followed by each unit’s model and plan."
  },
  "stacked-streets:27": {
    "heading": "Separating public streets from private homes",
    "body": "Within this form, public sky streets alternate with quieter residential levels. Shops, workshops and shared spaces welcome visitors, while homes retain their own communal areas. Separate public and residential lifts allow visitors to move between the streets without passing through the housing floors. The diagrams and cross-section show how these two routes sit together."
  },
  "stacked-streets:28": {
    "heading": "The neighbourhood as a whole",
    "body": "The axonometric brings the stacked homes, public streets and shared spaces together. It shows how the individual units contribute to a larger neighbourhood, with places for work, everyday encounters and time outdoors."
  },
  "stacked-streets:29": {
    "heading": "Life along the sky streets",
    "body": "The sky streets give these households a connection to the wider neighbourhood. I arranged public programmes around how long people might stay: bakeries and hawker stalls lower down for short visits, workshops in the middle for making and learning, and restaurants and gardens above for longer stays. These views explore the shared street as a place to spend time, rather than only a route through the building."
  },
  "stacked-streets:masterplan": {
    "heading": "Bukit Dermaga — the collective masterplan",
    "body": "Developed by our whole Core Studio 03 section, Bukit Dermaga brings housing, infrastructure and ecological systems into a shared river landscape. Ten infill plots respond to different conditions along the corridor, from existing infrastructure to water edges and planted ground. The intention is to support different forms of urban living while maintaining connections to water and landscape. My individual project occupies Plot 10 and explores the future of the shophouse within this collective framework."
  },
  "stacked-streets:site": {
    "heading": "Connecting to the river and neighbourhood",
    "body": "The plot sits beside existing HDB housing, parks and a riverfront community centre. I wanted the public ground level to connect with these surrounding places, so the building becomes part of the neighbourhood’s routes. The site studies also consider the monsoon directions, while the building follows the river and steps back to reduce exposure to the western sun."
  },
  "stacked-streets:building-model": {
    "heading": "The street as a physical model",
    "body": "The overall model shows the repeated homes and the wider shared street between them. The close-up makes the open circulation, planted façade and scale of the communal level easier to read."
  },
  "stacked-streets:unit-model": {
    "heading": "Looking inside the unit",
    "body": "The unit model shows how rooms, floor plates and openings relate across levels."
  },
  "stacked-streets:masterplan-reading": {
    "heading": "Reading the existing neighbourhood",
    "body": "As a studio section, we began by looking at tree cover, walking access and patterns of activity. These studies helped us read the site as a connected landscape rather than separate development parcels. The proposed canopy network links shaded spaces, while overlapping walking catchments bring more of the site within reach. Mapping activity alongside these connections informed where different intensities of use could sit."
  },
  "stacked-streets:masterplan-water": {
    "heading": "Letting water and landscape shape the plan",
    "body": "Our collective intention was to make the Kallang River an organising part of the neighbourhood. We explored reshaping the ground and expanding the relationship between water and landscape, so these systems could guide routes, public spaces and the placement of housing. The resulting shores, islands and changes in level give the masterplan its form and provide different conditions for each architectural proposal."
  },
  "stacked-streets:masterplan-connections": {
    "heading": "Connecting movement and ecology",
    "body": "We then developed the pedestrian and road networks alongside the ecological strategy. More continuous routes reconnect fragmented parts of the site, while planting and varied waterside conditions support different habitats. Together, these studies explain how circulation, public space and ecology contribute to the final masterplan rather than being added around the buildings afterwards."
  },
  "stacked-streets:intentions": {
    "heading": "My brief: a neighbourhood for living and working",
    "body": "E-commerce and increasing rents led me to ask how the shophouse could adapt. I wanted people to have a place to build a business without having to choose between work and home. My target users are creative solo-preneurs and freelancers, small-scale manufacturers and shophouse owners, including singles and multigenerational families. Their different routines informed the mix of unit types and shared spaces."
  },
  "stacked-streets:drawings": {
    "heading": "Reading the building in plan and section",
    "body": "The ground and typical block plans show how the public routes meet the homes and connect back to the surrounding neighbourhood. The roof plan and longitudinal section complete the sequence, showing the arrangement across the building and the relationship between its levels."
  }
};
