<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\Models\Service;
use App\Models\GalleryItem;
use App\Models\BlogPost;
use App\Models\Lead;
use App\Models\SeoConfig;

class ClinicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Admin users are created by RolesAndPermissionsSeeder (no hardcoded passwords)

        // 2. Seed Doctors
        $doctors = [
            // Leadership / Chairman (We can seed him as a special doctor or main bio)
            [
                'name' => 'Dr. K. Yogiraj',
                'qualification' => 'DV, MD (D&V)',
                'designation' => 'Chairman & MD',
                'bio' => 'Managing Director of the Yogiraj Centre for Dermatology & Cosmetology, brings an illustrious career spanning over five decades in Clinical and Cosmetic Dermatology. As a former Professor in the Department of Dermatology and Venereology at Medical College, Trivandrum, he has shaped the future of postgraduate education and research in dermatology.',
                'branch' => 'trivandrum',
                'instagram_url' => null,
                'active' => true,
                'image_path' => '/doctor_yogiraj.png',
            ],
            // Bangalore Team
            [
                'name' => 'Dr. Niranjana Raj',
                'qualification' => 'FRGUHS, MD (Dermatology, Venereology & Leprosy)',
                'designation' => 'Chief Consultant Dermatologist',
                'bio' => 'Lead consultant specializing in advanced lasers, aesthetic injectables, and clinical dermatology workflows.',
                'branch' => 'bangalore',
                'instagram_url' => 'https://www.instagram.com/drniranjanaraj/',
                'active' => true,
                'image_path' => null,
            ],
            [
                'name' => 'Dr. Yasmin Rehman',
                'qualification' => 'MBBS, DDVL',
                'designation' => 'Consultant Dermatologist',
                'bio' => 'Expert in chemical peels, acne therapies, and general clinical skin conditions.',
                'branch' => 'bangalore',
                'instagram_url' => null,
                'active' => true,
                'image_path' => null,
            ],
            [
                'name' => 'Dr. Vignessh Raj',
                'qualification' => 'MBBS, MD (Dermatology)',
                'designation' => 'Aesthetic Dermatologist',
                'bio' => 'Specializes in RF microneedling, skin resurfacing, and body shaping treatments.',
                'branch' => 'bangalore',
                'instagram_url' => null,
                'active' => true,
                'image_path' => null,
            ],
            [
                'name' => 'Dr. Vennela R',
                'qualification' => 'MBBS, MD',
                'designation' => 'Hair Transplant Surgeon',
                'bio' => 'Dedicated trichologist and hair transplant surgeon practicing FUE micro-grafting.',
                'branch' => 'bangalore',
                'instagram_url' => null,
                'active' => true,
                'image_path' => null,
            ],
            // Trivandrum Team
            [
                'name' => 'Dr. Maya Vincent',
                'qualification' => 'MBBS, MD – Dermatology',
                'designation' => 'Senior Consultant Dermatologist',
                'bio' => 'Expert senior physician with 15+ years experience in chronic skin conditions.',
                'branch' => 'trivandrum',
                'instagram_url' => null,
                'active' => true,
                'image_path' => '/doctor_maya.png',
            ],
            [
                'name' => 'Dr. Sunil Menon',
                'qualification' => 'MBBS, MD – Dermatology',
                'designation' => 'Consultant Dermatologist',
                'bio' => 'Specialist in laser treatments and pediatric dermatology.',
                'branch' => 'trivandrum',
                'instagram_url' => null,
                'active' => true,
                'image_path' => '/doctor_sunil.png',
            ],
            [
                'name' => 'Dr. Bismi Sherief',
                'qualification' => 'MBBS, DNB (Dermatology & Venereology)',
                'designation' => 'Consultant Dermatologist',
                'bio' => 'Expert clinical doctor focusing on venereology and autoimmune skin conditions.',
                'branch' => 'trivandrum',
                'instagram_url' => null,
                'active' => true,
                'image_path' => '/doctor_bismi.png',
            ],
            [
                'name' => 'Dr. Deepthi Benny',
                'qualification' => 'MBBS, DNB Dermatology',
                'designation' => 'Consultant Dermatologist',
                'bio' => 'Dedicated clinical practitioner specialized in hyperpigmentation and laser toning.',
                'branch' => 'trivandrum',
                'instagram_url' => null,
                'active' => true,
                'image_path' => '/doctor_deepthi.png',
            ],
            [
                'name' => 'Dr. Ryan Raju',
                'qualification' => 'MBBS, MD Dermatology, Venereology & Leprology',
                'designation' => 'Aesthetic Specialist',
                'bio' => 'Aesthetic expert focused on anti-wrinkle injections, dermal fillers, and thread lifts.',
                'branch' => 'trivandrum',
                'instagram_url' => null,
                'active' => true,
                'image_path' => '/doctor_ryan.png',
            ],
            [
                'name' => 'Dr. Devi Menon',
                'qualification' => 'MBBS, MD Dermatology, Venereology & Leprology',
                'designation' => 'Clinical Dermatologist',
                'bio' => 'Specializes in allergy testing, eczema management, and psoriasis protocols.',
                'branch' => 'trivandrum',
                'instagram_url' => null,
                'active' => true,
                'image_path' => '/doctor_devi.png',
            ],
            [
                'name' => 'Dr. Shruthi S Kumar',
                'qualification' => 'MBBS, MD Dermatology, Venereology & Leprology',
                'designation' => 'Consultant Dermatologist',
                'bio' => 'Clinical expert in acne scar management and chemical peeling strategies.',
                'branch' => 'trivandrum',
                'instagram_url' => null,
                'active' => true,
                'image_path' => '/doctor_shruthi.png',
            ],
            [
                'name' => 'Dr. Amy Mary Sebastian',
                'qualification' => 'MBBS, MD Dermatology, Venereology & Leprology',
                'designation' => 'Clinical Consultant',
                'bio' => 'Consulting clinical dermatologist focusing on general dermatological wellness.',
                'branch' => 'trivandrum',
                'instagram_url' => null,
                'active' => true,
                'image_path' => '/doctor_amy.png',
            ],
        ];

        foreach ($doctors as $doc) {
            Doctor::create($doc);
        }

        // 3. Seed Services
        $services = [
            // --- DERMATIC PROCEDURES (Trivandrum) ---
            [
                'id' => 'dust-allergy-test',
                'category' => 'skin',
                'category_name' => 'Dermatic - Allergy Test',
                'name' => 'Dust Allergy Test (Normal & Advanced)',
                'description' => 'Comprehensive dermatological allergen diagnostic panel to identify environmental dust mite and inhalant hypersensitivities.',
                'duration' => '45 mins',
                'price_range' => '₹2,000 - ₹4,500',
                'science' => 'Measures specific IgE antibodies against specific house dust mite proteins and airborne allergens.',
                'treats' => 'Atopic dermatitis, eczema flare-ups, chronic urticaria, allergic rhinitis.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'food-allergy-test',
                'category' => 'skin',
                'category_name' => 'Dermatic - Allergy Test',
                'name' => 'Food Allergy Test (Normal & Advanced)',
                'description' => 'Specialized blood & skin screening panel to detect food-induced dermatological reactions and systemic sensitivities.',
                'duration' => '45 mins',
                'price_range' => '₹2,500 - ₹5,500',
                'science' => 'Quantitative ELISA profiling of serum IgE antibodies against major dietary allergens.',
                'treats' => 'Food-induced hives, facial angioedema, recalcitrant eczema, digestive-skin flareups.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'food-allergy-prick',
                'category' => 'skin',
                'category_name' => 'Dermatic - Allergy Test',
                'name' => 'Food Allergy Test - Skin Prick',
                'description' => 'Rapid, gold-standard epicutaneous prick testing providing immediate 20-minute diagnostic results for acute food allergies.',
                'duration' => '30 mins',
                'price_range' => '₹1,800 - ₹3,200',
                'science' => 'Epidermal introduction of standardized allergen extracts triggering localized mast cell histamine release.',
                'treats' => 'Acute urticaria, immediate food sensitivity, oral allergy syndrome.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'asst-test',
                'category' => 'skin',
                'category_name' => 'Dermatic - Diagnostic',
                'name' => 'ASST (Autologous Serum Skin Test)',
                'description' => 'In-clinic intradermal diagnostic test to confirm autoimmune chronic spontaneous urticaria.',
                'duration' => '40 mins',
                'price_range' => '₹1,500',
                'science' => 'Intradermal injection of patient autologous serum to evaluate functional circulating histamine-releasing autoantibodies.',
                'treats' => 'Chronic spontaneous urticaria, unexplained daily hives, autoimmune dermatoses.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'biopsy-derm',
                'category' => 'skin',
                'category_name' => 'Dermatic - Histopathology',
                'name' => 'Biopsy (Hair, Skin, Nail & Mucosal)',
                'description' => 'Diagnostic punch or incisional tissue sampling under local anesthesia for definitive microscopic diagnosis.',
                'duration' => '30 mins',
                'price_range' => '₹2,000 - ₹4,000',
                'science' => 'Histopathological staining and cellular evaluation of tissue architecture by specialized dermatopathologists.',
                'treats' => 'Atypical skin lesions, scarring alopecia, blistering disorders, oral mucosal lesions.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'dif-test',
                'category' => 'skin',
                'category_name' => 'Dermatic - Immunopathology',
                'name' => 'DIF (Direct Immunofluorescence)',
                'description' => 'Specialized immunopathological tissue mapping for autoimmune blistering and connective tissue skin conditions.',
                'duration' => 'Consultation Required',
                'price_range' => '₹3,500 - ₹6,000',
                'science' => 'Fluorescein-conjugated antibody staining to visualize tissue-bound IgG, IgA, IgM, and complement deposits.',
                'treats' => 'Pemphigus vulgaris, bullous pemphigoid, lupus erythematosus, lichen planus.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'cryo-therapy',
                'category' => 'skin',
                'category_name' => 'Dermatic - Dermato-Surgery',
                'name' => 'Cryo (Cryotherapy Treatment)',
                'description' => 'Controlled liquid nitrogen sub-zero freezing application to target and remove benign skin lesions.',
                'duration' => '20 mins',
                'price_range' => '₹1,200 - ₹2,500',
                'science' => 'Rapid thermal reduction (-196°C) causing intracellular ice crystallization and selective tissue necrosis.',
                'treats' => 'Viral warts, seborrheic keratosis, actinic keratosis, molluscum contagiosum.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'ils-therapy',
                'category' => 'skin',
                'category_name' => 'Dermatic - Injection Care',
                'name' => 'ILS (Intralesional Steroids)',
                'description' => 'Direct targeted micro-injections of anti-inflammatory agents into resistant skin lesions and hair loss patches.',
                'duration' => '20 mins',
                'price_range' => '₹1,000 - ₹2,200',
                'science' => 'Delivers anti-mitotic and anti-inflammatory triamcinolone acetonide directly into active dermal lesions.',
                'treats' => 'Alopecia areata, hypertrophic scars, keloids, nodular cystic acne.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'electrocautery',
                'category' => 'skin',
                'category_name' => 'Dermatic & Aesthetic',
                'name' => 'Electrocautery (Warts, Moles & Skin Tags Removal)',
                'description' => 'Precision thermal radio-frequency removal of facial skin tags, benign moles, and verrucae under local numbing.',
                'duration' => '30-45 mins',
                'price_range' => '₹1,500 - ₹4,000',
                'science' => 'High-frequency electric current thermal coagulation ensuring bloodless tissue excision.',
                'treats' => 'Skin tags (acrochordons), facial moles, DPB, verruca vulgaris, seborrheic keratosis.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'patch-test',
                'category' => 'skin',
                'category_name' => 'Dermatic - Allergy Test',
                'name' => 'Patch Test (Standard Series)',
                'description' => 'Dermatological contact hypersensitivity testing to isolate chemical and environmental contact allergens.',
                'duration' => '48-72 hrs evaluation',
                'price_range' => '₹2,500 - ₹4,500',
                'science' => 'Dermal occlusion chambers applying standard series contactants to trigger type IV delayed T-cell hypersensitivity.',
                'treats' => 'Contact dermatitis, unexplained facial rashes, occupational hand eczema.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'cosmetic-patch-dye',
                'category' => 'skin',
                'category_name' => 'Dermatic - Allergy Test',
                'name' => 'Cosmetic Patch + Dye Test',
                'description' => 'Targeted sensitivity assessment for hair dyes (PPD), cosmetics, preservatives, and fragrance chemicals.',
                'duration' => '48 hrs evaluation',
                'price_range' => '₹2,000 - ₹3,500',
                'science' => 'Patch occlusion of personalized cosmetic formulations and dye elements.',
                'treats' => 'Hair dye allergy (PPD sensitivity), cosmetic dermatitis, eyelid dermatitis.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'phototherapy',
                'category' => 'skin',
                'category_name' => 'Dermatic - Light Therapy',
                'name' => 'Phototherapy Treatment (Narrowband UVB)',
                'description' => 'Medical-grade therapeutic light chamber treatments for widespread inflammatory and depigmenting skin conditions.',
                'duration' => '15-30 mins',
                'price_range' => '₹800 - ₹1,500/session',
                'science' => 'Narrowband 311nm UVB light immunosuppression targeting epidermal T-lymphocyte activity and melanocyte stimulation.',
                'treats' => 'Widespread vitiligo, psoriasis, stubborn eczema, lichen planus.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'comedone-extraction',
                'category' => 'skin',
                'category_name' => 'Dermatic - Acne Care',
                'name' => 'Comedone Extraction',
                'description' => 'Clinical manual extraction of stubborn blackheads and whiteheads using sterile dermatological extractors after ozone steam.',
                'duration' => '30 mins',
                'price_range' => '₹1,200',
                'science' => 'Keratolytic softening followed by physical evacuation of clogged follicular infundibulum.',
                'treats' => 'Closed and open comedones, congested pores, early stage acne vulgaris.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'xanthelasma-excision',
                'category' => 'aesthetics',
                'category_name' => 'Aesthetic Surgery',
                'name' => 'Xanthelasma Excision',
                'description' => 'Precision surgical or radiofrequency excision of peri-orbital yellow lipid deposits on upper/lower eyelids.',
                'duration' => '45 mins',
                'price_range' => '₹3,500 - ₹7,000',
                'science' => 'Micro-surgical plane dissection removing sub-epidermal cholesterol plaques with minimal cosmetic scarring.',
                'treats' => 'Eyelid xanthelasma palpebrarum, periorbital yellow plaques.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'vitiligo-surgeries',
                'category' => 'aesthetics',
                'category_name' => 'Aesthetic Surgery',
                'name' => 'Vitiligo Surgeries (Pigment Grafting)',
                'description' => 'Advanced surgical autologous punch grafting or suction blister epidermal grafting for stable vitiligo patches.',
                'duration' => '1-3 hours',
                'price_range' => 'Price on Consultation',
                'science' => 'Transplantation of functional melanocyte donor grafts into stable depigmented recipient beds.',
                'treats' => 'Stable vitiligo, focal depigmentation, post-traumatic leukoderma.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'nail-avulsion',
                'category' => 'skin',
                'category_name' => 'Dermatic - Minor Surgery',
                'name' => 'Nail Avulsion & Matrixectomy',
                'description' => 'Partial or total surgical removal of painful ingrown toenails under digital block anesthesia.',
                'duration' => '40 mins',
                'price_range' => '₹2,500 - ₹4,500',
                'science' => 'Digital anesthesia block, lateral nail spicule excision, and chemical phenol matrix ablation to prevent recurrence.',
                'treats' => 'Ingrown toenails (onychocryptosis), severe nail dystrophy, recalcitrant fungal nail infection.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],
            [
                'id' => 'keloid-excision',
                'category' => 'aesthetics',
                'category_name' => 'Aesthetic Surgery',
                'name' => 'Keloid Excision & Scar Revision',
                'description' => 'Surgical excision of large resistant earlobe or body keloids combined with intralesional steroid protocol.',
                'duration' => '60 mins',
                'price_range' => '₹4,000 - ₹9,000',
                'science' => 'Complete scar capsule excision followed by layered tension-free closure and adjuvant anti-fibrotic injections.',
                'treats' => 'Earlobe keloids, post-trauma hypertrophic scarring, chest keloids.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'dermatic'
            ],

            // --- COSMETIC PROCEDURES (Trivandrum) ---
            [
                'id' => 'revlite-laser',
                'category' => 'laser',
                'category_name' => 'Cosmetic Laser',
                'name' => 'Revlite Laser (Skin Lightening & Texture)',
                'description' => 'Advanced PhotoAcoustic Technology Q-switched laser for deep melanin breakdown, skin brightening, and pore refinement.',
                'duration' => '45 mins',
                'price_range' => '₹4,500 - ₹8,500',
                'science' => 'Nanosecond high-peak power acoustic shockwaves shattering sub-dermal pigment without thermal damage.',
                'treats' => 'Hyperpigmentation, melasma, sun spots, dull skin tone, open pores.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'soprano-diode',
                'category' => 'laser',
                'category_name' => 'Cosmetic Laser',
                'name' => 'Soprano-Diode Laser (Thick Hair Reduction)',
                'description' => 'US-FDA approved virtually painless diode laser targeting coarse and dense unwanted facial or body hair.',
                'duration' => '30-90 mins',
                'price_range' => '₹3,500 - ₹9,500',
                'science' => 'In-Motion CW diode thermal absorption targeting follicular melanin bulbs to permanently delay re-growth.',
                'treats' => 'Thick facial hair, hirsutism, chest/back hair, arm/leg hair reduction.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'resurfx-laser',
                'category' => 'laser',
                'category_name' => 'Cosmetic Laser',
                'name' => 'ResurFX Laser (Scars & Skin Tightening)',
                'description' => 'State-of-the-art 1565nm non-ablative laser for acne scar reduction, deep collagen remodeling, and non-surgical skin tightening.',
                'duration' => '60 mins',
                'price_range' => '₹7,500 - ₹12,000',
                'science' => 'Creates thousands of microscopic thermal columns stimulating neo-collagenesis with minimal epidermal downtime.',
                'treats' => 'Acne scar pits, surgical scars, fine wrinkles, enlarged pores, skin laxity.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'mnrf-laser',
                'category' => 'laser',
                'category_name' => 'Cosmetic Laser',
                'name' => 'Micro Needling Radio Frequency Laser (MNRF)',
                'description' => 'Gold-standard combination of insulated micro-needles and bipolar radiofrequency for severe acne scars and structural lift.',
                'duration' => '60 mins',
                'price_range' => '₹8,000 - ₹14,000',
                'science' => 'Direct dermal delivery of RF heat at exact microneedle depths to contract collagen fibers and flatten deep pits.',
                'treats' => 'Deep rolling & boxcar acne scars, sagging jawline, neck lines, stretch marks.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'secret-laser',
                'category' => 'laser',
                'category_name' => 'Cosmetic Laser',
                'name' => 'Secret Laser (Scars & Skin Tightening)',
                'description' => 'Fractional micro-needle RF system specifically designed for deep skin remodeling, scar smoothing, and pore contraction.',
                'duration' => '60 mins',
                'price_range' => '₹8,500 - ₹13,500',
                'science' => 'Adjustable micro-needle thermal coagulation zones to revitalize damaged dermal extracellular matrix.',
                'treats' => 'Acne scars, traumatic scars, facial laxity, uneven texture.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'tribeam-laser',
                'category' => 'laser',
                'category_name' => 'Cosmetic Laser',
                'name' => 'TriBeam Laser (Skin Lightening & Texture)',
                'description' => 'Dual-pulse Q-switched Nd:YAG laser for hyperpigmentation treatment, laser toning, and instant radiance.',
                'duration' => '45 mins',
                'price_range' => '₹4,500 - ₹8,000',
                'science' => 'Rich-PTP technology delivering double pulses to fragment dermal melanin gently while stimulating collagen.',
                'treats' => 'Post-acne dark marks, freckles, tanning, nevus of Ota, dull skin.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'peels',
                'category' => 'aesthetics',
                'category_name' => 'Cosmetic Skin Care',
                'name' => 'Medical Peels (Skin Resurfacing)',
                'description' => 'Custom dermatological chemical peels (Glycolic, Salicylic, Yellow Peel) tailored to clear pigmentation and restore skin luminosity.',
                'duration' => '30 mins',
                'price_range' => '₹2,200 - ₹4,500',
                'science' => 'Controlled chemical exfoliation accelerating epidermal turnover and un-clogging hyper-pigmented cells.',
                'treats' => 'Active acne, melasma, sun damage, dark spots, uneven complexion.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'botox',
                'category' => 'aesthetics',
                'category_name' => 'Cosmetic Aesthetics',
                'name' => 'Botox Treatment',
                'description' => 'FDA-approved purified protein micro-injections to relax expression lines and restore youthful facial contours.',
                'duration' => '30 mins',
                'price_range' => 'Price on Consultation',
                'science' => 'Targeted nerve signal blockage inhibiting dynamic muscle contractions that cause deep skin creases.',
                'treats' => 'Forehead lines, crow’s feet, frown lines, masseter jaw slimming.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'dermal-fillers',
                'category' => 'aesthetics',
                'category_name' => 'Cosmetic Aesthetics',
                'name' => 'Dermal Fillers',
                'description' => 'Hyaluronic acid soft-tissue fillers to add youthful volume, smooth deep laugh lines, and enhance cheek and lip structure.',
                'duration' => '45 mins',
                'price_range' => 'Price on Consultation',
                'science' => 'Cross-linked hyaluronic acid micro-gel binding water molecules to plump and lift dermal depressions.',
                'treats' => 'Under-eye hollows, smile lines (nasolabial folds), thin lips, sunken cheeks.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'hydrafacial',
                'category' => 'aesthetics',
                'category_name' => 'Cosmetic Aesthetics',
                'name' => 'Hydrafacial Medi-Facial',
                'description' => 'Patented multi-step facial to cleanse, vacuum pores, exfoliate dead cells, and infuse potent antioxidant serums.',
                'duration' => '60 mins',
                'price_range' => '₹5,000 - ₹7,500',
                'science' => 'Vortex-fusion spiral suction delivering salicylic acid, glycolic acid, and hyaluronic peptides.',
                'treats' => 'Clogged pores, dry dehydrated skin, oily skin, pre-event glowing skin.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'electrolysis',
                'category' => 'hair',
                'category_name' => 'Cosmetic Hair Removal',
                'name' => 'Electrolysis Hair Removal',
                'description' => 'Precision probe electrolysis for permanent removal of white, grey, red, or laser-resistant fine hair.',
                'duration' => '30-60 mins',
                'price_range' => '₹1,500 - ₹3,000/session',
                'science' => 'Direct electrical micro-current thermal destruction of individual hair root germinative cells.',
                'treats' => 'Grey facial hair, white chin hair, paradoxical hypertrichosis, stubborn single hairs.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'ear-piercing',
                'category' => 'aesthetics',
                'category_name' => 'Cosmetic Aesthetics',
                'name' => 'Ear Piercing (Medical Grade)',
                'description' => 'Sterile, painless medical ear piercing performed by trained clinical staff under aseptic conditions.',
                'duration' => '20 mins',
                'price_range' => '₹1,000 - ₹1,800',
                'science' => 'Precision aseptic pressure piercing using medical-grade surgical titanium studs to prevent nickel allergies.',
                'treats' => 'Safe earlobe piercing, cartilage piercing, pediatric ear piercing.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'nose-piercing',
                'category' => 'aesthetics',
                'category_name' => 'Cosmetic Aesthetics',
                'name' => 'Nose Piercing (Medical Grade)',
                'description' => 'Hygienic, gentle nostril piercing using sterile titanium hardware for fast, infection-free healing.',
                'duration' => '20 mins',
                'price_range' => '₹1,200 - ₹2,000',
                'science' => 'Sterile single-use medical cartridge insertion with anti-bacterial post-care protocol.',
                'treats' => 'Hygienic nostril piercing, alar piercing.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'ear-lobe-repair',
                'category' => 'aesthetics',
                'category_name' => 'Cosmetic Aesthetics',
                'name' => 'Ear Lobe Repair',
                'description' => 'Surgical or non-surgical sutureless repair of stretched, elongated, or completely split earlobe holes.',
                'duration' => '40 mins',
                'price_range' => '₹2,500 - ₹5,000',
                'science' => 'Epithelial edge excision followed by micro-suturing or tissue adhesive bonding for seamless healing.',
                'treats' => 'Split earlobes, widened earring holes, torn lobules.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'mesotherapy',
                'category' => 'hair',
                'category_name' => 'Cosmetic Skin & Hair',
                'name' => 'Mesotherapy (Skin & Hair Micro-Infusion)',
                'description' => 'Micro-injections of potent vitamins, minerals, amino acids, and growth factors into the scalp or facial dermis.',
                'duration' => '45 mins',
                'price_range' => '₹3,000 - ₹5,500',
                'science' => 'Mesodermal micro-delivery of bio-revitalizing cocktails stimulating cellular metabolism.',
                'treats' => 'Early hair thinning, dull facial skin, loss of skin elasticity.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'stem-cell-therapy',
                'category' => 'hair',
                'category_name' => 'Cosmetic Hair Care',
                'name' => 'Stem Cell Therapy for Hair',
                'description' => 'Advanced cellular therapy utilizing plant/peptide stem cell extracts to reactivate dormant hair follicles.',
                'duration' => '50 mins',
                'price_range' => '₹4,500 - ₹7,500',
                'science' => 'Infusion of concentrated signal factors that prolong the anagen (growth) phase of hair bulbs.',
                'treats' => 'Progressive thinning, hair shedding, weak fragile hair shafts.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'gfc',
                'category' => 'hair',
                'category_name' => 'Cosmetic Hair Care',
                'name' => 'GFC (Growth Factor Concentrate) Therapy',
                'description' => 'Next-generation acellular growth factor therapy derived from your blood for maximum follicular stimulation.',
                'duration' => '45 mins',
                'price_range' => '₹5,500 - ₹9,000',
                'science' => 'High-concentration platelet-derived growth factors (PDGF, VEGF, IGF-1) injected cleanly without RBC/WBC contaminants.',
                'treats' => 'Androgenetic alopecia, telogen effluvium, post-illness hair fall.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'prp',
                'category' => 'hair',
                'category_name' => 'Cosmetic Hair Care',
                'name' => 'PRP (Platelet-Rich Plasma) Therapy',
                'description' => 'Autologous concentrated plasma injections enriched with natural growth factors to reverse hair thinning.',
                'duration' => '60 mins',
                'price_range' => '₹4,500/session',
                'science' => 'Centrifuged autologous blood plasma delivering active growth factors to hair root stems.',
                'treats' => 'Hair thinning, hair fall, pattern baldness, receding hair.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'transplant',
                'category' => 'hair',
                'category_name' => 'Cosmetic Hair Care',
                'name' => 'Hair Transplantation (FUE Grafting)',
                'description' => 'Permanent surgical hair restoration harvesting healthy individual hair grafts for dense, natural-looking hairline reconstruction.',
                'duration' => '4-8 hours',
                'price_range' => 'Consultation Required',
                'science' => 'Follicular Unit Extraction (FUE) ensuring zero linear scarring and lifetime permanent growth.',
                'treats' => 'Male pattern baldness, female hairline thinning, crown balding.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ],
            [
                'id' => 'smp-hair',
                'category' => 'hair',
                'category_name' => 'Cosmetic Hair Care',
                'name' => 'Scalp Micro Pigmentation (SMP)',
                'description' => 'Medical aesthetic hair tattooing technique creating the realistic appearance of full hair follicles on thinning scalps.',
                'duration' => '2-4 hours',
                'price_range' => 'Price on Consultation',
                'science' => 'Micro-pigment dermal implantation simulating natural short shaved hair follicles.',
                'treats' => 'Diffuse hair loss, visible scalp skin, post-transplant donor scars.',
                'active' => true,
                'branch' => 'trivandrum',
                'procedure_type' => 'cosmetic'
            ]
        ];

        foreach ($services as $srv) {
            Service::create($srv);
        }

        // 4. Seed Gallery Items
        $gallery = [
            [
                'id' => 'before-after-4',
                'type' => 'image',
                'category' => 'treatments',
                'title' => 'Before After - Hair Transplant Density',
                'thumbnail_path' => 'https://ycdc.in/wp-content/uploads/2025/08/eed5800b-c58f-4e3d-a7cf-36350a19166c.jpg',
                'video_path' => null,
                'description' => 'Excellent density and natural hairline restoration 6 months after a FUE hair transplant session.'
            ],
            [
                'id' => 'before-after-3',
                'type' => 'image',
                'category' => 'treatments',
                'title' => 'Before After - Hair Line Restoration',
                'thumbnail_path' => 'https://ycdc.in/wp-content/uploads/2025/05/ycdc-before-after2-880x808.jpeg',
                'video_path' => null,
                'description' => 'Frontal hairline restoration showing significant density and natural growth.'
            ],
            [
                'id' => 'before-after-2',
                'type' => 'image',
                'category' => 'treatments',
                'title' => 'Before After - Acne Scar Correction',
                'thumbnail_path' => 'https://ycdc.in/wp-content/uploads/2025/08/eed5800b-c58f-4e3d-a7cf-36350a19166c.jpg',
                'video_path' => null,
                'description' => 'Visible skin smoothing and reduction of deep pitted acne scars after 3 sessions of Secret RF Microneedling.'
            ],
            [
                'id' => 'image-1',
                'type' => 'image',
                'category' => 'treatments',
                'title' => 'Trichoscopy Scalp Examination',
                'thumbnail_path' => 'https://ycdc.in/wp-content/uploads/2025/05/cosmetologist-doing-trichoscopy-and-watching-resul-2024-10-18-10-16-52-utc-scaled.jpg',
                'video_path' => null,
                'description' => 'Digital trichoscopy scalp analysis to evaluate hair root health and map out custom treatments.'
            ],
            [
                'id' => 'clinic-lobby',
                'type' => 'image',
                'category' => 'infrastructure',
                'title' => 'YCDC Luxury Lobby & Reception',
                'thumbnail_path' => 'https://ycdc.in/wp-content/uploads/2025/05/DSC09954-scaled.jpg',
                'video_path' => null,
                'description' => 'Our welcoming reception lounge designed to provide patients with a calming and premium clinical environment.'
            ],
            [
                'id' => 'before-after-6',
                'type' => 'image',
                'category' => 'treatments',
                'title' => 'Before After - Pigmentation Treatment',
                'thumbnail_path' => 'https://ycdc.in/wp-content/uploads/2025/05/ycdc-before-after6-880x808.jpeg',
                'video_path' => null,
                'description' => 'Advanced Q-Switched laser toning and chemical peel results for melasma and dark spots.'
            ],
            [
                'id' => 'treatment-showcase-video',
                'type' => 'video',
                'category' => 'treatments',
                'title' => 'YCDC Clinic Experience Tour',
                'thumbnail_path' => 'https://ycdc.in/wp-content/uploads/2025/05/Dr.-NR-Opd.jpg',
                'video_path' => 'https://www.youtube.com/watch?v=RWr8XeBUxTU',
                'description' => 'Detailed clinical video tour demonstrating our professional environment, FDA-approved lasers, and workflows.'
            ]
        ];

        foreach ($gallery as $g) {
            GalleryItem::create($g);
        }

        // 5. Seed Blogs
        $blogs = [
            [
                'id' => 'ycdc-skin-care-tips',
                'category' => 'skin',
                'category_label' => 'Skin Care',
                'title' => 'Skin Care Tips – For Healthy & Glowing Skin',
                'author' => 'Dr. Niranjana Raj (Chief Consultant)',
                'date' => 'August 24, 2025',
                'read_time' => '3 min read',
                'excerpt' => 'Beautiful skin starts with the right care. At YCDC, we believe in simple yet effective skin care practices that keep your skin nourished, hydrated, and radiant every day.',
                'image_path' => 'https://ycdc.in/wp-content/uploads/2025/07/beautiful-young-indian-woman-enjoying-face-lifting-2025-03-18-17-16-15-utc-scaled.jpg',
                'body_content' => [
                    'Beautiful skin starts with the right care. At YCDC, we believe in simple yet effective skin care practices that keep your skin nourished, hydrated, and radiant every day. Using cutting-edge ResurFX Laser and Secret RF Microneedling, we effectively target pimple scars, uneven texture, and active breakouts.',
                    '1. Protect Your Skin from Sun Damage: Always use a broad-spectrum sunscreen with SPF 30 or higher. UVA and UVB rays accelerate skin aging and trigger hyperpigmentation. Reapply sunscreen every 3 hours if outdoors.',
                    '2. Keep Your Skin Hydrated: Drinking adequate water and using a hyaluronic acid-based moisturizer helps lock in moisture, strengthening the skin barrier against environmental pollutants.',
                    '3. Follow a Gentle Cleansing Routine: Cleanse your face twice daily with a soap-free, pH-balanced cleanser suitable for your skin type. Avoid harsh scrubbing which can cause micro-tears.'
                ]
            ],
            [
                'id' => 'laser-hair-reduction-guide',
                'category' => 'anti-aging',
                'category_label' => 'Lasers',
                'title' => 'A Complete Guide to Laser Hair Reduction',
                'author' => 'Dr. K. Yogiraj (Chairman)',
                'date' => 'July 15, 2025',
                'read_time' => '4 min read',
                'excerpt' => 'Understand how US-FDA approved laser systems deliver permanent hair reduction safely across all skin types with zero downtime.',
                'image_path' => 'https://ycdc.in/wp-content/uploads/2025/05/a-girl-in-black-underwear-gets-laser-hair-removal-2025-03-24-12-57-40-utc-scaled-500x450.jpg',
                'body_content' => [
                    'Embrace self-confidence and overcome the hassle of frequent waxing or shaving. Laser hair reduction uses selective photothermolysis to target melanin in hair follicles, disabling their growth cycle permanently without damaging surrounding skin tissue.',
                    'At YCDC, we utilize US-FDA approved triple-wavelength lasers that are exceptionally safe for Indian skin types. The integrated cooling tips ensure the treatment is virtually painless.',
                    'Normally, a series of 6 to 8 sessions is required to target hairs in their active growth (anagen) phase. Sessions are spaced 4 to 6 weeks apart, revealing smooth, hair-free skin with no recovery downtime.'
                ]
            ],
            [
                'id' => 'hair-loss-solutions',
                'category' => 'hair',
                'category_label' => 'Hair Care',
                'title' => 'Restoring Hair Health: Reasons and Modern Treatments for Hair Loss',
                'author' => 'Dr. Vennela R (Hair Specialist)',
                'date' => 'June 10, 2025',
                'read_time' => '5 min read',
                'excerpt' => 'Experiencing hair thinning? Explore the biological reasons behind hair fall and clinical hair loss solutions including PRP and FUE transplants.',
                'image_path' => 'https://ycdc.in/wp-content/uploads/2025/05/a-beautician-makes-injections-into-the-scalp-for-h-2024-12-01-11-09-23-utc-scaled.jpg',
                'body_content' => [
                    'Hair loss causing thinning or baldness is a very common concern. Understanding the root cause—whether it is genetic androgenetic alopecia, hormonal imbalances, nutritional deficiencies, or stress-induced telogen effluvium—is the first step to successful restoration.',
                    'Modern trichology offers highly effective solutions: medications to block DHT, Platelet-Rich Plasma (PRP) scalp injections to stimulate hair bulbs, and FUE hair transplant surgery.',
                    'FUE involves harvesting healthy hair follicles from the donor area (usually the back of the head) and transplanting them into balding zones. It delivers lifelong growth, natural direction, and maximum hair density.'
                ]
            ]
        ];

        foreach ($blogs as $b) {
            BlogPost::create($b);
        }

        // 6. Seed SEO Configs
        $seo = [
            [
                'route_name' => 'home',
                'title' => 'YCDC | Yogiraj Centre for Dermatology & Cosmetology',
                'meta_description' => 'Premium dermatology & cosmetology clinics in Whitefield, Bangalore & Pattom, Trivandrum.',
                'keywords' => 'dermatology, cosmetology, clinic, skin care, hair care, Bangalore, Trivandrum'
            ],
            [
                'route_name' => 'about',
                'title' => 'About Us | YCDC Dermatology Center',
                'meta_description' => 'Learn about our 50+ year legacy of excellence in clinical and cosmetic dermatology led by Dr. K. Yogiraj.',
                'keywords' => 'about ycdc, ycdc legacy, dr yogiraj'
            ],
            [
                'route_name' => 'team',
                'title' => 'Our Medical Specialists | YCDC',
                'meta_description' => 'Consult our board-certified dermatologists, trichologists, and transplant surgeons practicing at Bangalore & Trivandrum.',
                'keywords' => 'ycdc doctors, dermatologists bangalore, dermatologists trivandrum'
            ],
            [
                'route_name' => 'before-after',
                'title' => 'Clinical Transformations | YCDC',
                'meta_description' => 'View authentic, un-retouched results of clinical hair transplants and deep acne scar resurfacing.',
                'keywords' => 'before after hair transplant, acne scar results'
            ],
            [
                'route_name' => 'treatments',
                'title' => 'Dermatology & Cosmetology Treatments | YCDC',
                'meta_description' => 'Browse our US-FDA approved clinical lasers, chemical peels, and cosmetic injectables.',
                'keywords' => 'skin treatments, hair transplant price, laser hair removal'
            ],
            [
                'route_name' => 'gallery',
                'title' => 'Clinic Gallery | YCDC',
                'meta_description' => 'Take a virtual tour of our luxury lobby, state-of-the-art laser rooms, and clinical spaces.',
                'keywords' => 'ycdc clinic tour, skin clinic lobby'
            ],
            [
                'route_name' => 'blog',
                'title' => 'Skin & Hair Health Blog | YCDC',
                'meta_description' => 'Expert dermatological advice, sunscreen guides, and hair therapy explanations written by our doctors.',
                'keywords' => 'skincare blog, hair loss tips, prp therapy explanation'
            ],
            [
                'route_name' => 'contact',
                'title' => 'Contact Us | YCDC Bangalore & Trivandrum',
                'meta_description' => 'Book your priority consultation or virtual diagnosis at our Whitefield (Bangalore) or Pattom (Trivandrum) branches.',
                'keywords' => 'book dermatologist appt, ycdc contact number'
            ]
        ];

        foreach ($seo as $s) {
            SeoConfig::create($s);
        }

        // 7. Seed Leads
        $leads = [
            [
                'branch' => 'Whitefield, Bangalore',
                'patient_name' => 'Ramesh Kumar',
                'patient_phone' => '9845012345',
                'patient_email' => 'ramesh.k@gmail.com',
                'service_requested' => 'PRP Hair Growth Therapy',
                'doctor_requested' => 'Dr. Vennela Reddy',
                'preferred_date' => '2026-06-25',
                'preferred_time' => '11:00 AM',
                'concern_type' => 'Hair & Scalp',
                'medical_history' => 'Experiencing severe hair thinning on the crown for the past 6 months.',
                'photo_attached' => null,
                'status' => 'Confirmed',
                'type' => 'Appointment',
                'notes' => 'Confirmed slot, patient notified.'
            ],
            [
                'branch' => 'Pattom, Trivandrum',
                'patient_name' => 'Ananya Pillai',
                'patient_phone' => '9447012345',
                'patient_email' => 'ananya.p@yahoo.com',
                'service_requested' => 'Premium Chemical Peels',
                'doctor_requested' => 'Dr. Maya Vincent',
                'preferred_date' => '2026-06-26',
                'preferred_time' => '02:45 PM',
                'concern_type' => 'Skin Care',
                'medical_history' => 'Looking to treat post-acne pigmentation and uneven skin tone.',
                'photo_attached' => null,
                'status' => 'Contacted',
                'type' => 'Appointment',
                'notes' => 'Called, left voicemail. Scheduled follow-up email.'
            ],
            [
                'branch' => 'Whitefield, Bangalore',
                'patient_name' => 'Rohit Sharma',
                'patient_phone' => '9900012345',
                'patient_email' => 'rohit.s@gmail.com',
                'service_requested' => null,
                'doctor_requested' => null,
                'preferred_date' => null,
                'preferred_time' => null,
                'concern_type' => 'Acne, Pimples & Scars',
                'medical_history' => 'Frequent cystic acne breakouts on cheeks and jawline. No previous clinical treatments.',
                'photo_attached' => 'jawline_acne_left.jpg',
                'status' => 'Pending',
                'type' => 'Online Consultation',
                'notes' => null
            ],
            [
                'branch' => 'Pattom, Trivandrum',
                'patient_name' => 'Meera Nair',
                'patient_phone' => '9496054321',
                'patient_email' => 'meera.nair@hotmail.com',
                'service_requested' => null,
                'doctor_requested' => null,
                'preferred_date' => null,
                'preferred_time' => null,
                'concern_type' => 'Fine Lines, Wrinkles & Anti-Aging',
                'medical_history' => 'Interested in non-surgical anti-aging solutions. Noticeable fine lines around eyes.',
                'photo_attached' => 'forehead_wrinkles.jpg',
                'status' => 'Contacted',
                'type' => 'Online Consultation',
                'notes' => 'Discussed Botox vs Hydrafacial.'
            ]
        ];

        foreach ($leads as $l) {
            Lead::create($l);
        }
    }
}
