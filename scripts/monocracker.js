import { monoDecrypt } from './monoalphabetic.js';

// English letter frequency (from most common to least common)
const ENGLISH_FREQUENCY = "ETAOINSHRDLUCMFWYPVBGKJQXZ";

// English digraph frequencies (most common pairs of letters)
const ENGLISH_DIGRAPHS = ["TH", "HE", "IN", "ER", "AN", "RE", "ON", "AT", "EN", "ND", "TI", "ES", "OR", "TE", "OF", "ED", "IS", "IT", "AL", "AR", "ST", "TO", "NT", "NG", "SE", "HA", "AS", "OU", "IO", "LE"];

// English trigraph frequencies (most common triplets of letters)
const ENGLISH_TRIGRAPHS = ["THE", "AND", "THA", "ENT", "ING", "ION", "TIO", "FOR", "NDE", "HAS", "NCE", "EDT", "TIS", "OFT", "STH", "MEN"];

// Common English words for validation (expanded)
const COMMON_WORDS = ["THE", "AND", "THAT", "HAVE", "FOR", "NOT", "WITH", "YOU", "THIS", "BUT", "HIS", "FROM", "THEY", "SAY", "HER", "SHE", "WILL", "ONE", "ALL", "WOULD", "THERE", "THEIR", "WHAT", "OUT", "ABOUT", "WHO", "GET", "WHICH", "WHEN", "MAKE", "CAN", "LIKE", "TIME", "JUST", "HIM", "KNOW", "TAKE", "PEOPLE", "INTO", "YEAR", "YOUR", "GOOD", "SOME", "COULD", "THEM", "SEE", "OTHER", "THAN", "THEN", "NOW", "LOOK", "ONLY", "COME", "ITS", "OVER", "THINK", "ALSO", "BACK", "AFTER", "USE", "TWO", "HOW", "OUR", "WORK", "FIRST", "WELL", "WAY", "EVEN", "NEW", "WANT", "BECAUSE", "ANY", "THESE", "GIVE", "DAY", "MOST", "US", "WAS", "BEEN", "WERE", "ARE", "SAID", "EACH", "MANY", "SOME", "SUCH", "THOSE", "MADE", "MAY", "PART", "OVER", "STILL", "DOWN", "SHOULD", "WHILE", "NEVER", "MIGHT", "WHERE", "MUST", "BEFORE", "THROUGH", "MUCH", "BEING", "BOTH", "BETWEEN", "UNDER", "AGAINST", "DURING", "WITHOUT", "PLACE", "AMERICAN", "HOWEVER", "THOUGH", "AGAIN", "WORLD", "LIFE", "VERY", "LITTLE", "ANOTHER", "AROUND", "CAME", "COME", "DOES", "EVERY", "HOUSE", "LAST", "NEED", "THING", "TOLD", "WENT", "AWAY", "SINCE", "SOMETHING", "NOTHING", "EVERYTHING", "SOMEONE", "ANYONE", "EVERYONE", "NOBODY", "EVERYBODY", "ALWAYS", "TOGETHER", "ALREADY", "ENOUGH", "EVER", "NEVER", "REALLY", "SIMPLY", "ALMOST", "SOON", "LATER", "EARLY", "YESTERDAY", "TODAY", "TOMORROW", "WEEK", "MONTH", "YEAR", "HOUR", "MINUTE", "SECOND", "MORNING", "AFTERNOON", "EVENING", "NIGHT", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER", "POLITICAL", "GOVERNMENT", "PRESIDENT", "COUNTRY", "NATION", "STATE", "CITY", "TOWN", "VILLAGE", "STREET", "ROAD", "AVENUE", "BUILDING", "HOUSE", "HOME", "OFFICE", "SCHOOL", "COLLEGE", "UNIVERSITY", "HOSPITAL", "CHURCH", "MARKET", "STORE", "SHOP", "RESTAURANT", "HOTEL", "BANK", "STATION", "AIRPORT", "HARBOR", "PORT", "BRIDGE", "RIVER", "LAKE", "OCEAN", "SEA", "MOUNTAIN", "HILL", "FOREST", "DESERT", "ISLAND", "BEACH", "COAST", "BORDER", "REGION", "AREA", "DISTRICT", "ZONE", "SPACE", "FIELD", "GARDEN", "PARK", "FARM", "RANCH", "FACTORY", "PLANT", "MINE", "WELL", "TOWER", "CASTLE", "PALACE", "TEMPLE", "MOSQUE", "CATHEDRAL", "CHAPEL", "SHRINE", "TOMB", "GRAVE", "CEMETERY", "MONUMENT", "STATUE", "FOUNTAIN", "SQUARE", "PLAZA", "COURT", "YARD", "LAWN", "PATIO", "DECK", "PORCH", "BALCONY", "TERRACE", "ROOF", "WALL", "FENCE", "GATE", "DOOR", "WINDOW", "FLOOR", "CEILING", "STAIRS", "ELEVATOR", "ESCALATOR", "CORRIDOR", "HALL", "ROOM", "KITCHEN", "BATHROOM", "BEDROOM", "LIVING", "DINING", "STUDY", "LIBRARY", "LABORATORY", "WORKSHOP", "STUDIO", "GALLERY", "MUSEUM", "THEATER", "CINEMA", "CONCERT", "STADIUM", "ARENA", "COURT", "FIELD", "TRACK", "POOL", "GYM", "PARK", "ZOO", "AQUARIUM", "GARDEN", "FARM", "RANCH", "VINEYARD", "ORCHARD", "PLANTATION", "FOREST", "JUNGLE", "DESERT", "OASIS", "PLAIN", "PRAIRIE", "MEADOW", "VALLEY", "CANYON", "CLIFF", "CAVE", "VOLCANO", "GLACIER", "ICEBERG", "ARCTIC", "ANTARCTIC", "EQUATOR", "TROPICS", "HEMISPHERE", "CONTINENT", "PENINSULA", "ISTHMUS", "STRAIT", "CHANNEL", "GULF", "BAY", "COVE", "HARBOR", "PORT", "DOCK", "PIER", "WHARF", "JETTY", "LIGHTHOUSE", "BUOY", "SHIP", "BOAT", "YACHT", "FERRY", "CRUISE", "SUBMARINE", "AIRCRAFT", "AIRPLANE", "HELICOPTER", "JET", "ROCKET", "MISSILE", "SATELLITE", "SPACECRAFT", "STATION", "VEHICLE", "CAR", "TRUCK", "BUS", "TRAIN", "TRAM", "SUBWAY", "METRO", "MONORAIL", "CABLE", "GONDOLA", "BICYCLE", "MOTORCYCLE", "SCOOTER", "WAGON", "CART", "SLED", "SLEIGH", "SKATE", "SKI", "SNOWBOARD", "SURFBOARD", "SAILBOARD", "CANOE", "KAYAK", "RAFT", "BALLOON", "PARACHUTE", "GLIDER", "HANG", "PARAGLIDER", "ANIMAL", "MAMMAL", "BIRD", "FISH", "REPTILE", "AMPHIBIAN", "INSECT", "ARACHNID", "MOLLUSK", "CRUSTACEAN", "WORM", "BACTERIA", "VIRUS", "FUNGUS", "PLANT", "TREE", "SHRUB", "BUSH", "VINE", "FLOWER", "GRASS", "WEED", "MOSS", "FERN", "ALGAE", "HUMAN", "PERSON", "PEOPLE", "MAN", "WOMAN", "CHILD", "BOY", "GIRL", "BABY", "TODDLER", "YOUTH", "TEEN", "ADULT", "SENIOR", "ELDER", "FAMILY", "PARENT", "FATHER", "MOTHER", "SON", "DAUGHTER", "BROTHER", "SISTER", "UNCLE", "AUNT", "NEPHEW", "NIECE", "COUSIN", "GRANDPARENT", "GRANDFATHER", "GRANDMOTHER", "GRANDCHILD", "GRANDSON", "GRANDDAUGHTER", "HUSBAND", "WIFE", "SPOUSE", "PARTNER", "FIANCÉ", "FIANCÉE", "BOYFRIEND", "GIRLFRIEND", "LOVER", "FRIEND", "ENEMY", "NEIGHBOR", "COLLEAGUE", "COWORKER", "BOSS", "EMPLOYEE", "MANAGER", "SUPERVISOR", "WORKER", "STAFF", "CREW", "TEAM", "GROUP", "GANG", "CLUB", "SOCIETY", "ASSOCIATION", "ORGANIZATION", "INSTITUTION", "CORPORATION", "COMPANY", "BUSINESS", "FIRM", "AGENCY", "BUREAU", "DEPARTMENT", "DIVISION", "SECTION", "UNIT", "BRANCH", "OFFICE", "HEADQUARTERS", "BASE", "CAMP", "POST", "STATION", "CENTER", "FACILITY", "COMPLEX", "COMPOUND", "SETTLEMENT", "COLONY", "COMMUNITY", "SOCIETY", "CIVILIZATION", "CULTURE", "TRADITION", "CUSTOM", "HABIT", "PRACTICE", "RITUAL", "CEREMONY", "CELEBRATION", "FESTIVAL", "HOLIDAY", "VACATION", "TRIP", "JOURNEY", "VOYAGE", "EXPEDITION", "TOUR", "CRUISE", "SAFARI", "PILGRIMAGE", "MIGRATION", "IMMIGRATION", "EMIGRATION", "EXILE", "REFUGEE", "ASYLUM", "CITIZENSHIP", "NATIONALITY", "ETHNICITY", "RACE", "TRIBE", "CLAN", "DYNASTY", "KINGDOM", "EMPIRE", "REPUBLIC", "DEMOCRACY", "DICTATORSHIP", "MONARCHY", "ARISTOCRACY", "OLIGARCHY", "PLUTOCRACY", "THEOCRACY", "ANARCHY", "REVOLUTION", "REBELLION", "UPRISING", "REVOLT", "RIOT", "PROTEST", "DEMONSTRATION", "STRIKE", "BOYCOTT", "EMBARGO", "SANCTION", "BLOCKADE", "SIEGE", "INVASION", "OCCUPATION", "LIBERATION", "RESISTANCE", "GUERRILLA", "TERRORISM", "EXTREMISM", "RADICALISM", "FUNDAMENTALISM", "CONSERVATISM", "LIBERALISM", "SOCIALISM", "COMMUNISM", "CAPITALISM", "IMPERIALISM", "COLONIALISM", "NATIONALISM", "PATRIOTISM", "GLOBALIZATION", "INTERNATIONALISM", "DIPLOMACY", "NEGOTIATION", "MEDIATION", "ARBITRATION", "TREATY", "AGREEMENT", "CONTRACT", "COVENANT", "PACT", "ALLIANCE", "COALITION", "FEDERATION", "CONFEDERATION", "UNION", "LEAGUE", "BLOC", "AXIS", "FACTION", "PARTY", "MOVEMENT", "CAMPAIGN", "CRUSADE", "JIHAD", "MISSION", "QUEST", "VENTURE", "ENTERPRISE", "PROJECT", "PROGRAM", "PLAN", "SCHEME", "STRATEGY", "TACTIC", "MANEUVER", "OPERATION", "ACTION", "ACTIVITY", "BEHAVIOR", "CONDUCT", "MANNER", "ATTITUDE", "APPROACH", "METHOD", "TECHNIQUE", "PROCEDURE", "PROCESS", "SYSTEM", "MECHANISM", "DEVICE", "APPARATUS", "INSTRUMENT", "TOOL", "IMPLEMENT", "UTENSIL", "APPLIANCE", "MACHINE", "ENGINE", "MOTOR", "GENERATOR", "TURBINE", "REACTOR", "COMPUTER", "CALCULATOR", "PROCESSOR", "MEMORY", "STORAGE", "DISK", "DRIVE", "TAPE", "CARD", "CHIP", "CIRCUIT", "BOARD", "CABLE", "WIRE", "CORD", "STRING", "THREAD", "FIBER", "FILAMENT", "STRAND", "HAIR", "FUR", "WOOL", "FEATHER", "SCALE", "SHELL", "SKIN", "HIDE", "LEATHER", "PELT", "BONE", "SKELETON", "SKULL", "SPINE", "JOINT", "MUSCLE", "TENDON", "LIGAMENT", "TISSUE", "ORGAN", "HEART", "LUNG", "LIVER", "KIDNEY", "STOMACH", "INTESTINE", "BRAIN", "NERVE", "VESSEL", "ARTERY", "VEIN", "CAPILLARY", "BLOOD", "PLASMA", "SERUM", "LYMPH", "HORMONE", "ENZYME", "PROTEIN", "CARBOHYDRATE", "LIPID", "NUCLEIC", "ACID", "GENE", "CHROMOSOME", "CELL", "NUCLEUS", "CYTOPLASM", "MEMBRANE", "WALL", "FOOD", "DRINK", "MEAL", "BREAKFAST", "LUNCH", "DINNER", "SUPPER", "SNACK", "APPETIZER", "ENTREE", "DESSERT", "MEAT", "POULTRY", "SEAFOOD", "VEGETABLE", "FRUIT", "GRAIN", "CEREAL", "BREAD", "PASTA", "RICE", "POTATO", "BEAN", "NUT", "SEED", "HERB", "SPICE", "SALT", "PEPPER", "SUGAR", "HONEY", "SYRUP", "SAUCE", "GRAVY", "SOUP", "STEW", "CASSEROLE", "SALAD", "SANDWICH", "BURGER", "PIZZA", "PIE", "CAKE", "COOKIE", "CANDY", "CHOCOLATE", "ICE", "CREAM", "YOGURT", "CHEESE", "BUTTER", "MARGARINE", "OIL", "VINEGAR", "WATER", "JUICE", "SODA", "COFFEE", "TEA", "MILK", "BEER", "WINE", "LIQUOR", "SPIRIT", "COCKTAIL", "CLOTHING", "GARMENT", "OUTFIT", "COSTUME", "UNIFORM", "DRESS", "SKIRT", "PANTS", "TROUSERS", "JEANS", "SHORTS", "SHIRT", "BLOUSE", "SWEATER", "JACKET", "COAT", "SUIT", "VEST", "UNDERWEAR", "SOCK", "STOCKING", "SHOE", "BOOT", "SANDAL", "SLIPPER", "GLOVE", "MITTEN", "HAT", "CAP", "HELMET", "CROWN", "TIARA", "VEIL", "SCARF", "TIE", "BELT", "SUSPENDER", "BUTTON", "ZIPPER", "BUCKLE", "CLASP", "HOOK", "JEWELRY", "ORNAMENT", "ACCESSORY", "RING", "BRACELET", "NECKLACE", "PENDANT", "LOCKET", "BROOCH", "PIN", "EARRING", "WATCH", "CLOCK", "COMPASS", "WEAPON", "ARMOR", "SHIELD", "SWORD", "KNIFE", "DAGGER", "SPEAR", "LANCE", "ARROW", "BOW", "CROSSBOW", "SLING", "CLUB", "MACE", "HAMMER", "AXE", "HATCHET", "PIKE", "HALBERD", "STAFF", "WAND", "BATON", "FIREARM", "GUN", "PISTOL", "REVOLVER", "RIFLE", "SHOTGUN", "MACHINE", "CANNON", "MORTAR", "MISSILE", "BOMB", "GRENADE", "MINE", "TORPEDO", "AMMUNITION", "BULLET", "SHELL", "CARTRIDGE", "POWDER", "EXPLOSIVE", "DYNAMITE", "PLASTIC", "NAPALM", "CHEMICAL", "BIOLOGICAL", "NUCLEAR", "RADIATION", "FALLOUT", "CONTAMINATION", "POLLUTION", "WASTE", "GARBAGE", "TRASH", "LITTER", "DEBRIS", "JUNK", "SCRAP", "MATERIAL", "SUBSTANCE", "MATTER", "ELEMENT", "COMPOUND", "MIXTURE", "SOLUTION", "SUSPENSION", "COLLOID", "GAS", "LIQUID", "SOLID", "PLASMA", "CRYSTAL", "METAL", "ALLOY", "CERAMIC", "GLASS", "PLASTIC", "RUBBER", "WOOD", "PAPER", "CARDBOARD", "CLOTH", "FABRIC", "TEXTILE", "CANVAS", "LEATHER", "STONE", "ROCK", "MINERAL", "GEM", "JEWEL", "DIAMOND", "RUBY", "SAPPHIRE", "EMERALD", "PEARL", "AMBER", "CORAL", "JADE", "QUARTZ", "CRYSTAL", "MARBLE", "GRANITE", "LIMESTONE", "SANDSTONE", "SLATE", "CLAY", "SOIL", "DIRT", "DUST", "SAND", "GRAVEL", "PEBBLE", "BOULDER", "CONCRETE", "CEMENT", "MORTAR", "PLASTER", "STUCCO", "ADOBE", "BRICK", "TILE", "SHINGLE", "THATCH", "PAINT", "VARNISH", "LACQUER", "ENAMEL", "STAIN", "DYE", "INK", "PIGMENT", "COLOR", "HUE", "SHADE", "TINT", "TONE", "LIGHT", "DARK", "BRIGHT", "DIM", "SHADOW", "REFLECTION", "REFRACTION", "DIFFRACTION", "INTERFERENCE", "POLARIZATION", "SPECTRUM", "RAINBOW", "PRISM", "LENS", "MIRROR", "TELESCOPE", "MICROSCOPE", "BINOCULARS", "CAMERA", "PROJECTOR", "SCREEN", "MONITOR", "DISPLAY", "PANEL", "CONSOLE", "KEYBOARD", "MOUSE", "JOYSTICK", "CONTROLLER", "REMOTE", "SENSOR", "DETECTOR", "SCANNER", "PRINTER", "COPIER", "FAX", "TELEPHONE", "MOBILE", "CELLULAR", "SMARTPHONE", "TABLET", "LAPTOP", "DESKTOP", "MAINFRAME", "SERVER", "NETWORK", "INTERNET", "WEB", "SITE", "PAGE", "LINK", "URL", "EMAIL", "MESSAGE", "TEXT", "CHAT", "FORUM", "BLOG", "WIKI", "SOCIAL", "MEDIA", "PLATFORM", "APPLICATION", "SOFTWARE", "PROGRAM", "CODE", "SCRIPT", "ALGORITHM", "FUNCTION", "VARIABLE", "CONSTANT", "PARAMETER", "ARGUMENT", "VALUE", "TYPE", "CLASS", "OBJECT", "INSTANCE", "METHOD", "PROPERTY", "ATTRIBUTE", "FIELD", "RECORD", "FILE", "FOLDER", "DIRECTORY", "PATH", "ROOT", "BRANCH", "LEAF", "NODE", "EDGE", "VERTEX", "POINT", "LINE", "CURVE", "SURFACE", "VOLUME", "SPACE", "DIMENSION", "COORDINATE", "POSITION", "LOCATION", "DIRECTION", "ORIENTATION", "ANGLE", "DEGREE", "RADIAN", "CIRCLE", "SPHERE", "ELLIPSE", "ELLIPSOID", "PARABOLA", "PARABOLOID", "HYPERBOLA", "HYPERBOLOID", "CONE", "CYLINDER", "CUBE", "CUBOID", "PRISM", "PYRAMID", "POLYHEDRON", "POLYGON", "TRIANGLE", "QUADRILATERAL", "PENTAGON", "HEXAGON", "OCTAGON", "SQUARE", "RECTANGLE", "RHOMBUS", "PARALLELOGRAM", "TRAPEZOID", "TRAPEZIUM", "KITE", "REGULAR", "IRREGULAR", "SYMMETRY", "ASYMMETRY", "CONGRUENCE", "SIMILARITY", "TRANSFORMATION", "TRANSLATION", "ROTATION", "REFLECTION", "DILATION", "CONTRACTION", "EXPANSION", "COMPRESSION", "TENSION", "STRESS", "STRAIN", "PRESSURE", "FORCE", "ENERGY", "POWER", "WORK", "HEAT", "TEMPERATURE", "FRICTION", "GRAVITY", "MAGNETISM", "ELECTRICITY", "CURRENT", "VOLTAGE", "RESISTANCE", "CAPACITANCE", "INDUCTANCE", "IMPEDANCE", "FREQUENCY", "WAVELENGTH", "AMPLITUDE", "PHASE", "RESONANCE", "VIBRATION", "OSCILLATION", "WAVE", "PARTICLE", "QUANTUM", "ATOM", "MOLECULE", "ION", "ELECTRON", "PROTON", "NEUTRON", "QUARK", "LEPTON", "BOSON", "FERMION", "HADRON", "BARYON", "MESON", "NUCLEUS", "ISOTOPE", "RADIOACTIVITY", "DECAY", "FISSION", "FUSION", "REACTION", "CATALYST", "ENZYME", "ACID", "BASE", "SALT", "OXIDE", "HYDROXIDE", "HYDRATE", "ANHYDRIDE", "ORGANIC", "INORGANIC", "HYDROCARBON", "ALCOHOL", "PHENOL", "ETHER", "ALDEHYDE", "KETONE", "CARBOXYLIC", "ESTER", "AMINE", "AMIDE", "NITRILE", "NITRO", "SULFIDE", "SULFATE", "SULFITE", "PHOSPHATE", "PHOSPHITE", "HALIDE", "FLUORIDE", "CHLORIDE", "BROMIDE", "IODIDE", "METAL", "NONMETAL", "METALLOID", "ALKALI", "ALKALINE", "EARTH", "TRANSITION", "LANTHANIDE", "ACTINIDE", "NOBLE", "HALOGEN", "HYDROGEN", "HELIUM", "LITHIUM", "BERYLLIUM", "BORON", "CARBON", "NITROGEN", "OXYGEN", "FLUORINE", "NEON", "SODIUM", "MAGNESIUM", "ALUMINUM", "SILICON", "PHOSPHORUS", "SULFUR", "CHLORINE", "ARGON", "POTASSIUM", "CALCIUM", "SCANDIUM", "TITANIUM", "VANADIUM", "CHROMIUM", "MANGANESE", "IRON", "COBALT", "NICKEL", "COPPER", "ZINC", "GALLIUM", "GERMANIUM", "ARSENIC", "SELENIUM", "BROMINE", "KRYPTON", "RUBIDIUM", "STRONTIUM", "YTTRIUM", "ZIRCONIUM", "NIOBIUM", "MOLYBDENUM", "TECHNETIUM", "RUTHENIUM", "RHODIUM", "PALLADIUM", "SILVER", "CADMIUM", "INDIUM", "TIN", "ANTIMONY", "TELLURIUM", "IODINE", "XENON", "CESIUM", "BARIUM", "LANTHANUM", "CERIUM", "PRASEODYMIUM", "NEODYMIUM", "PROMETHIUM", "SAMARIUM", "EUROPIUM", "GADOLINIUM", "TERBIUM", "DYSPROSIUM", "HOLMIUM", "ERBIUM", "THULIUM", "YTTERBIUM", "LUTETIUM", "HAFNIUM", "TANTALUM", "TUNGSTEN", "RHENIUM", "OSMIUM", "IRIDIUM", "PLATINUM", "GOLD", "MERCURY", "THALLIUM", "LEAD", "BISMUTH", "POLONIUM", "ASTATINE", "RADON", "FRANCIUM", "RADIUM", "ACTINIUM", "THORIUM", "PROTACTINIUM", "URANIUM", "NEPTUNIUM", "PLUTONIUM", "AMERICIUM", "CURIUM", "BERKELIUM", "CALIFORNIUM", "EINSTEINIUM", "FERMIUM", "MENDELEVIUM", "NOBELIUM", "LAWRENCIUM", "RUTHERFORDIUM", "DUBNIUM", "SEABORGIUM", "BOHRIUM", "HASSIUM", "MEITNERIUM", "DARMSTADTIUM", "ROENTGENIUM", "COPERNICIUM", "NIHONIUM", "FLEROVIUM", "MOSCOVIUM", "LIVERMORIUM", "TENNESSINE", "OGANESSON", "DIRECT", "CONTACT", "POLITICAL", "REPRESENTATIVES", "VIET", "CONG", "MOSCOW", "INFORMAL", "YESTERDAY", "DISCLOSED", "SEVERAL", "BEEN", "MADE"];

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const cipherText = document.getElementById('cipherText');
    const frequencyBtn = document.getElementById('frequencyBtn');
    const bruteForceBtn = document.getElementById('bruteForceBtn');
    const knownPlaintextBtn = document.getElementById('knownPlaintextBtn');
    const frequencyOptions = document.getElementById('frequencyOptions');
    const bruteForceOptions = document.getElementById('bruteForceOptions');
    const knownPlaintextOptions = document.getElementById('knownPlaintextOptions');
    const showFrequencyChart = document.getElementById('showFrequencyChart');
    const maxResults = document.getElementById('maxResults');
    const knownPlaintextInput = document.getElementById('knownPlaintextInput');
    const crackBtn = document.getElementById('crackBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const frequencyChartContainer = document.getElementById('frequencyChartContainer');
    const frequencyChart = document.getElementById('frequencyChart');
    const keysList = document.getElementById('keysList');
    const decryptedResults = document.getElementById('decryptedResults');
    const statusMessage = document.getElementById('statusMessage');

    // Current cracking method
    let currentMethod = 'frequency';

    // Method selection buttons
    frequencyBtn.addEventListener('click', () => {
        if (currentMethod !== 'frequency') {
            currentMethod = 'frequency';
            updateMethodUI();
        }
    });

    bruteForceBtn.addEventListener('click', () => {
        if (currentMethod !== 'bruteforce') {
            currentMethod = 'bruteforce';
            updateMethodUI();
        }
    });

    knownPlaintextBtn.addEventListener('click', () => {
        if (currentMethod !== 'knownplaintext') {
            currentMethod = 'knownplaintext';
            updateMethodUI();
        }
    });

    // Update UI based on selected method
    function updateMethodUI() {
        // Update button states
        frequencyBtn.classList.toggle('active', currentMethod === 'frequency');
        bruteForceBtn.classList.toggle('active', currentMethod === 'bruteforce');
        knownPlaintextBtn.classList.toggle('active', currentMethod === 'knownplaintext');
        
        // Show/hide appropriate options
        frequencyOptions.style.display = currentMethod === 'frequency' ? 'block' : 'none';
        bruteForceOptions.style.display = currentMethod === 'bruteforce' ? 'block' : 'none';
        knownPlaintextOptions.style.display = currentMethod === 'knownplaintext' ? 'block' : 'none';
    }

    // Crack button click handler
    crackBtn.addEventListener('click', () => {
        const text = cipherText.value.trim().toUpperCase();
        
        if (!text) {
            alert('Please enter cipher text to crack');
            return;
        }
        
        // Clear previous results
        keysList.innerHTML = '';
        decryptedResults.innerHTML = '';
        frequencyChart.innerHTML = '';
        statusMessage.textContent = 'Processing...';
        statusMessage.style.display = 'block';
        
        // Show results container
        resultsContainer.style.display = 'block';
        
        // Use setTimeout to allow the UI to update before starting the computation
        setTimeout(() => {
            try {
                if (currentMethod === 'frequency') {
                    crackWithFrequencyAnalysis(text);
                } else if (currentMethod === 'bruteforce') {
                    crackWithHillClimbing(text);
                } else if (currentMethod === 'knownplaintext') {
                    const knownText = knownPlaintextInput.value.trim().toUpperCase();
                    if (!knownText) {
                        alert('Please enter known plaintext for this method');
                        statusMessage.style.display = 'none';
                        return;
                    }
                    crackWithKnownPlaintext(text, knownText);
                }
                statusMessage.style.display = 'none';
            } catch (error) {
                console.error('Error during cracking:', error);
                statusMessage.textContent = 'Error: ' + error.message;
            }
        }, 50);
    });

    // Enhanced frequency analysis cracking method
    function crackWithFrequencyAnalysis(text) {
        // Get letter frequencies in the ciphertext
        const frequencies = getLetterFrequencies(text);
        
        // Get digraph frequencies in the ciphertext
        const digraphFreqs = getDigraphFrequencies(text);
        
        // Sort letters by frequency (most frequent first)
        const sortedCipherLetters = Object.keys(frequencies).sort((a, b) => 
            frequencies[b] - frequencies[a]
        );
        
        // Create initial mapping based on frequency analysis
        const initialMapping = {};
        const usedLetters = new Set();
        
        // Map the sorted cipher letters to English frequency
        for (let i = 0; i < sortedCipherLetters.length; i++) {
            const cipherLetter = sortedCipherLetters[i];
            // Only map letters that appear in the cipher
            if (i < ENGLISH_FREQUENCY.length) {
                initialMapping[cipherLetter] = ENGLISH_FREQUENCY[i];
                usedLetters.add(ENGLISH_FREQUENCY[i]);
            }
        }
        
        // For any unmapped letters in the alphabet, assign unused English letters
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let unusedIndex = 0;
        
        for (const letter of alphabet) {
            if (!sortedCipherLetters.includes(letter)) {
                // Find an unused English letter
                while (unusedIndex < ENGLISH_FREQUENCY.length && 
                       usedLetters.has(ENGLISH_FREQUENCY[unusedIndex])) {
                    unusedIndex++;
                }
                
                if (unusedIndex < ENGLISH_FREQUENCY.length) {
                    initialMapping[letter] = ENGLISH_FREQUENCY[unusedIndex];
                    usedLetters.add(ENGLISH_FREQUENCY[unusedIndex]);
                }
            }
        }
        
        // Create the key from the mapping
        let key = createKeyFromMapping(initialMapping);
        
        // Refine the key using hill climbing
        const refinedKey = hillClimb(text, key, 1000);
        
        // Decrypt using both keys
        const initialDecrypted = monoDecrypt(text, key);
        const refinedDecrypted = monoDecrypt(text, refinedKey);
        
        // Calculate scores
        const initialScore = calculateTextScore(initialDecrypted);
        const refinedScore = calculateTextScore(refinedDecrypted);
        
        // Display the results
        const results = [
            { key: refinedKey, score: refinedScore, decrypted: refinedDecrypted, label: "Refined" },
            { key: key, score: initialScore, decrypted: initialDecrypted, label: "Initial" }
        ].sort((a, b) => b.score - a.score);
        
        displayResults(results);
        
        // Show frequency chart if enabled
        if (showFrequencyChart.checked) {
            displayFrequencyChart(frequencies);
        } else {
            frequencyChartContainer.style.display = 'none';
        }
    }

    // Hill climbing algorithm for optimization
    function crackWithHillClimbing(text) {
        const maxAttempts = parseInt(maxResults.value) || 5;
        const results = [];
        
        // Start with multiple random keys
        for (let i = 0; i < maxAttempts; i++) {
            // Generate a random starting key
            const randomKey = generateRandomKey();
            
            // Refine the key using hill climbing
            const refinedKey = hillClimb(text, randomKey, 2000);
            
            // Decrypt using the refined key
            const decrypted = monoDecrypt(text, refinedKey);
            
            // Calculate score
            const score = calculateTextScore(decrypted);
            
            results.push({ 
                key: refinedKey, 
                score, 
                decrypted,
                label: `Attempt ${i+1}`
            });
        }
        
        // Sort results by score
        const sortedResults = results.sort((a, b) => b.score - a.score);
        
        // Display the results
        displayResults(sortedResults);
        
        // Hide frequency chart for brute force method
        frequencyChartContainer.style.display = 'none';
    }

    // Known plaintext attack
    function crackWithKnownPlaintext(ciphertext, knownPlaintext) {
        // Clean up inputs - remove spaces and non-alphabetic characters
        const cleanCipher = ciphertext.replace(/[^A-Z]/g, '');
        const cleanPlain = knownPlaintext.replace(/[^A-Z]/g, '');
        
        if (cleanPlain.length < 3) {
            alert('Known plaintext must be at least 3 letters long');
            statusMessage.style.display = 'none';
            return;
        }
        
        // Find all possible positions of the known plaintext in the ciphertext
        const possiblePositions = [];
        
        for (let i = 0; i <= cleanCipher.length - cleanPlain.length; i++) {
            possiblePositions.push(i);
        }
        
        const results = [];
        
        // Try each possible position
        for (const position of possiblePositions) {
            // Extract the corresponding ciphertext segment
            const cipherSegment = cleanCipher.substring(position, position + cleanPlain.length);
            
            // Create a partial mapping based on this alignment
            const partialMapping = {};
            const usedCipherLetters = new Set();
            const usedPlainLetters = new Set();
            
            let validMapping = true;
            
            // Check if this alignment creates a valid mapping
            for (let i = 0; i < cleanPlain.length; i++) {
                const plainChar = cleanPlain[i];
                const cipherChar = cipherSegment[i];
                
                // If we've seen this cipher letter before, it must map to the same plain letter
                if (usedCipherLetters.has(cipherChar)) {
                    if (partialMapping[cipherChar] !== plainChar) {
                        validMapping = false;
                        break;
                    }
                }
                
                // If we've seen this plain letter before, it must be mapped from the same cipher letter
                if (usedPlainLetters.has(plainChar)) {
                    const existingCipherChar = Object.keys(partialMapping).find(
                        key => partialMapping[key] === plainChar
                    );
                    if (existingCipherChar !== cipherChar) {
                        validMapping = false;
                        break;
                    }
                }
                
                // Add to the mapping
                partialMapping[cipherChar] = plainChar;
                usedCipherLetters.add(cipherChar);
                usedPlainLetters.add(plainChar);
            }
            
            if (!validMapping) continue;
            
            // Complete the mapping for remaining letters
            const fullMapping = completeMapping(partialMapping);
            
            // Create a key from the mapping
            const key = createKeyFromMapping(fullMapping);
            
            // Decrypt the full ciphertext
            const decrypted = monoDecrypt(ciphertext, key);
            
            // Calculate score
            const score = calculateTextScore(decrypted);
            
            results.push({
                key,
                score,
                decrypted,
                label: `Position ${position+1}`
            });
        }
        
        if (results.length === 0) {
            // If no direct matches, try hill climbing with the known plaintext as a constraint
            const constrainedKey = hillClimbWithConstraint(ciphertext, knownPlaintext, 2000);
            const decrypted = monoDecrypt(ciphertext, constrainedKey);
            const score = calculateTextScore(decrypted);
            
            results.push({
                key: constrainedKey,
                score,
                decrypted,
                label: "Constrained"
            });
        }
        
        // Sort results by score
        const sortedResults = results.sort((a, b) => b.score - a.score);
        
        // Display the results
        displayResults(sortedResults);
        
        // Hide frequency chart for known plaintext method
        frequencyChartContainer.style.display = 'none';
    }

    // Complete a partial mapping to a full mapping
    function completeMapping(partialMapping) {
        const fullMapping = {...partialMapping};
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // Find used cipher and plain letters
        const usedCipherLetters = new Set(Object.keys(partialMapping));
        const usedPlainLetters = new Set(Object.values(partialMapping));
        
        // Get unused cipher and plain letters
        const unusedCipherLetters = [...alphabet].filter(letter => !usedCipherLetters.has(letter));
        const unusedPlainLetters = [...alphabet].filter(letter => !usedPlainLetters.has(letter));
        
        // Assign unused plain letters to unused cipher letters based on frequency
        for (let i = 0; i < unusedCipherLetters.length && i < unusedPlainLetters.length; i++) {
            fullMapping[unusedCipherLetters[i]] = unusedPlainLetters[i];
        }
        
        return fullMapping;
    }

    // Hill climbing with a constraint from known plaintext
    function hillClimbWithConstraint(ciphertext, knownPlaintext, iterations) {
        // Clean up inputs
        const cleanCipher = ciphertext.replace(/[^A-Z]/g, '');
        const cleanPlain = knownPlaintext.replace(/[^A-Z]/g, '');
        
        // Start with a random key
        let key = generateRandomKey();
        let bestKey = key;
        let bestScore = -Infinity;
        
        for (let i = 0; i < iterations; i++) {
            // Swap two random letters in the key
            const newKey = swapRandomLetters(key);
            
            // Decrypt with the new key
            const decrypted = monoDecrypt(ciphertext, newKey);
            
            // Calculate score with extra weight for matching the known plaintext
            const baseScore = calculateTextScore(decrypted);
            
            // Check if the known plaintext appears in the decrypted text
            const cleanDecrypted = decrypted.replace(/[^A-Z]/g, '');
            const knownTextScore = cleanDecrypted.includes(cleanPlain) ? 1000 : 0;
            
            const totalScore = baseScore + knownTextScore;
            
            // If this key is better, keep it
            if (totalScore > bestScore) {
                bestScore = totalScore;
                bestKey = newKey;
                key = newKey;
            } else if (Math.random() < 0.1) {
                // Sometimes accept a worse key to avoid local maxima
                key = newKey;
            }
        }
        
        return bestKey;
    }

    // Hill climbing algorithm for key optimization
    function hillClimb(text, initialKey, iterations) {
        let key = initialKey;
        let bestKey = key;
        let bestScore = calculateTextScore(monoDecrypt(text, key));
        
        for (let i = 0; i < iterations; i++) {
            // Swap two random letters in the key
            const newKey = swapRandomLetters(key);
            
            // Decrypt with the new key
            const decrypted = monoDecrypt(text, newKey);
            
            // Calculate score
            const score = calculateTextScore(decrypted);
            
            // If this key is better, keep it
            if (score > bestScore) {
                bestScore = score;
                bestKey = newKey;
                key = newKey;
            } else if (Math.random() < 0.1) {
                // Sometimes accept a worse key to avoid local maxima
                key = newKey;
            }
        }
        
        return bestKey;
    }

    // Create a key from a mapping
    function createKeyFromMapping(mapping) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let key = '';
        
        for (const letter of alphabet) {
            key += mapping[letter] || letter;
        }
        
        return key;
    }

    // Generate a random key (random permutation of the alphabet)
    function generateRandomKey() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        
        // Fisher-Yates shuffle
        for (let i = alphabet.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
        }
        
        return alphabet.join('');
    }

    // Helper function to get letter frequencies in text
    function getLetterFrequencies(text) {
        const frequencies = {};
        let letterCount = 0;
        
        // Count occurrences of each letter
        for (const char of text) {
            if (/[A-Z]/.test(char)) {
                frequencies[char] = (frequencies[char] || 0) + 1;
                letterCount++;
            }
        }
        
        // Convert counts to percentages
        if (letterCount > 0) {
            for (const letter in frequencies) {
                frequencies[letter] = frequencies[letter] / letterCount;
            }
        }
        
        return frequencies;
    }

    // Helper function to get digraph (letter pair) frequencies
    function getDigraphFrequencies(text) {
        const frequencies = {};
        let digraphCount = 0;
        
        // Remove non-alphabetic characters
        const cleanText = text.replace(/[^A-Z]/g, '');
        
        // Count occurrences of each digraph
        for (let i = 0; i < cleanText.length - 1; i++) {
            const digraph = cleanText.substring(i, i + 2);
            frequencies[digraph] = (frequencies[digraph] || 0) + 1;
            digraphCount++;
        }
        
        // Convert counts to percentages
        if (digraphCount > 0) {
            for (const digraph in frequencies) {
                frequencies[digraph] = frequencies[digraph] / digraphCount;
            }
        }
        
        return frequencies;
    }

    // Helper function to get trigraph (letter triplet) frequencies
    function getTrigraphFrequencies(text) {
        const frequencies = {};
        let trigraphCount = 0;
        
        // Remove non-alphabetic characters
        const cleanText = text.replace(/[^A-Z]/g, '');
        
        // Count occurrences of each trigraph
        for (let i = 0; i < cleanText.length - 2; i++) {
            const trigraph = cleanText.substring(i, i + 3);
            frequencies[trigraph] = (frequencies[trigraph] || 0) + 1;
            trigraphCount++;
        }
        
        // Convert counts to percentages
        if (trigraphCount > 0) {
            for (const trigraph in frequencies) {
                frequencies[trigraph] = frequencies[trigraph] / trigraphCount;
            }
        }
        
        return frequencies;
    }

    // Enhanced scoring function for text evaluation
    function calculateTextScore(text) {
        let score = 0;
        
        // Clean the text (remove non-alphabetic characters)
        const cleanText = text.replace(/[^A-Z\s]/g, ' ').replace(/\s+/g, ' ').trim();
        
        // Split into words
        const words = cleanText.split(/\s+/).filter(word => word.length > 0);
        
        // Score based on common English words
        for (const word of words) {
            if (COMMON_WORDS.includes(word)) {
                // Longer common words get higher scores
                score += word.length * 2;
            }
        }
        
        // Score based on digraphs (letter pairs)
        const cleanTextNoSpaces = cleanText.replace(/\s+/g, '');
        for (let i = 0; i < cleanTextNoSpaces.length - 1; i++) {
            const digraph = cleanTextNoSpaces.substring(i, i + 2);
            if (ENGLISH_DIGRAPHS.includes(digraph)) {
                score += 1;
            }
        }
        
        // Score based on trigraphs (letter triplets)
        for (let i = 0; i < cleanTextNoSpaces.length - 2; i++) {
            const trigraph = cleanTextNoSpaces.substring(i, i + 3);
            if (ENGLISH_TRIGRAPHS.includes(trigraph)) {
                score += 2;
            }
        }
        
        // Score based on letter frequencies
        const letterFreqs = getLetterFrequencies(cleanTextNoSpaces);
        const expectedFreqs = {
            'E': 0.1202, 'T': 0.0910, 'A': 0.0812, 'O': 0.0768, 'I': 0.0731,
            'N': 0.0695, 'S': 0.0628, 'R': 0.0602, 'H': 0.0592, 'D': 0.0432,
            'L': 0.0398, 'U': 0.0288, 'C': 0.0271, 'M': 0.0261, 'F': 0.0230,
            'Y': 0.0211, 'W': 0.0209, 'G': 0.0203, 'P': 0.0182, 'B': 0.0149,
            'V': 0.0111, 'K': 0.0069, 'X': 0.0017, 'Q': 0.0011, 'J': 0.0010, 'Z': 0.0007
        };
        
        // Calculate frequency score (lower is better)
        let freqScore = 0;
        for (const letter in expectedFreqs) {
            const observed = letterFreqs[letter] || 0;
            const expected = expectedFreqs[letter];
            freqScore += Math.abs(observed - expected);
        }
        
        // Convert to a positive score (higher is better)
        score += (1 - freqScore) * 100;
        
        // Add bonus for reasonable word lengths
        if (words.length > 0) {
            const wordLengths = words.map(word => word.length);
            const avgWordLength = wordLengths.reduce((sum, len) => sum + len, 0) / words.length;
            
            // English words average around 4-5 letters
            if (avgWordLength > 3 && avgWordLength < 7) {
                score += 20;
            }
        }
        
        // Add bonus for reasonable spacing
        const spaceFreq = (cleanText.match(/\s/g) || []).length / cleanText.length;
        if (spaceFreq > 0.1 && spaceFreq < 0.3) {
            score += 20;
        }
        
        return score;
    }

    // Helper function to swap two random letters in a key
    function swapRandomLetters(key) {
        const keyArray = key.split('');
        const i = Math.floor(Math.random() * keyArray.length);
        let j = Math.floor(Math.random() * keyArray.length);
        
        // Make sure we pick different indices
        while (j === i) {
            j = Math.floor(Math.random() * keyArray.length);
        }
        
        // Swap the letters
        [keyArray[i], keyArray[j]] = [keyArray[j], keyArray[i]];
        
        return keyArray.join('');
    }

    // Display the results in the UI
    function displayResults(results) {
        keysList.innerHTML = '';
        decryptedResults.innerHTML = '';
        
        results.forEach((result, index) => {
            // Create key display
            const keyItem = document.createElement('div');
            keyItem.className = 'key-item';
            
            const keyHeader = document.createElement('h4');
            keyHeader.textContent = `Key ${index + 1}${result.label ? ` (${result.label})` : ''} - Score: ${result.score.toFixed(2)}`;
            
            const keyText = document.createElement('div');
            keyText.className = 'key-text';
            keyText.textContent = `${result.key}`;
            
            const keyMapping = document.createElement('div');
            keyMapping.className = 'key-mapping';
            keyMapping.innerHTML = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z<br>' + 
                                  result.key.split('').join(' ');
            
            keyItem.appendChild(keyHeader);
            keyItem.appendChild(keyText);
            keyItem.appendChild(keyMapping);
            keysList.appendChild(keyItem);
            
            // Create decrypted text display
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            const resultHeader = document.createElement('h4');
            resultHeader.textContent = `Result ${index + 1}${result.label ? ` (${result.label})` : ''}`;
            
            const resultText = document.createElement('div');
            resultText.className = 'result-text';
            resultText.textContent = result.decrypted;
            
            resultItem.appendChild(resultHeader);
            resultItem.appendChild(resultText);
            decryptedResults.appendChild(resultItem);
        });
    }

    // Display frequency chart
    function displayFrequencyChart(frequencies) {
        frequencyChartContainer.style.display = 'block';
        frequencyChart.innerHTML = '';
        
        // Sort letters by frequency
        const sortedLetters = Object.keys(frequencies).sort((a, b) => 
            frequencies[b] - frequencies[a]
        );
        
        // Create bars for each letter
        for (const letter of sortedLetters) {
            const frequency = frequencies[letter];
            
            const barContainer = document.createElement('div');
            barContainer.className = 'chart-bar-container';
            
            const letterLabel = document.createElement('div');
            letterLabel.className = 'chart-label';
            letterLabel.textContent = letter;
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.width = `${Math.max(frequency * 500, 5)}px`;
            
            const percentLabel = document.createElement('div');
            percentLabel.className = 'chart-percent';
            percentLabel.textContent = `${(frequency * 100).toFixed(1)}%`;
            
            barContainer.appendChild(letterLabel);
            barContainer.appendChild(bar);
            barContainer.appendChild(percentLabel);
            
            frequencyChart.appendChild(barContainer);
        }
    }
});
