# Outfit Creator source records

These records cover the clothing PNG files used by the RollForFantasy Outfit Creator source page.

## Source and page relationship

- Source page: https://rollforfantasy.com/tools/outfit-creator.php
- Clothing image root used by the source page: https://rollforfantasy.com/images/clothing/{nmale|nfemale}/{filename}
- The source page loads ../scripts/clothingGen2.js; that script builds front layer URLs from the selected model directory (nmale or nfemale) and builds back layer URLs by adding the b prefix.
- The source page's ../css/clothingBgs2.css defines the selectable front clothing IDs. The page's HTML includes shirt IDs shirt1 through shirt60 across its two shirt groups.
- Local directories preserve the source model directory names: public/outfit-creator/nmale/ and public/outfit-creator/nfemale/.

## Imported clothing counts

| Side | Filename prefix | Count per gender |
| --- | --- | ---: |
| Front | jacket | 30 |
| Front | shirt | 60 |
| Front | pants | 30 |
| Front | skirt | 30 |
| Front | shoes | 30 |
| Front | scarf | 30 |
| Front | belt | 30 |
| Front | gloves | 30 |
| Back | bjacket | 30 |
| Back | bshirt | 60 |
| Back | bskirt | 30 |
| Back | bshoes | 30 |

- Front clothing per gender: 270 PNG files.
- Back clothing per gender: 150 PNG files.
- Total clothing per gender: 420 PNG files.
- Total imported clothing: 840 PNG files.
- Imported front total: 540 PNG files.
- Imported back total: 300 PNG files.
- Total imported bytes: 2142608.

## Body image relationship

The source page uses body images at ../images/armor/{male|female}/body.png. Those bytes were already verified against the existing local files public/armor-creator/male/body.png and public/armor-creator/female/body.png; no body PNG was duplicated under public/outfit-creator/.

## Verification performed

- Every listed source URL returned HTTP status 200.
- Every response reported Content-Type image/png.
- Every response passed the PNG signature and positive IHDR width/height checks.
- SHA256 and byte length were computed from every source response.
- Every local file was read back and matched its source SHA256 and byte length.
- The final on-disk PNG count was checked against the expected 840 files.

## Measured sample dimensions and hashes

- nmale/jacket1.png: 155x203 px, 6348 bytes, SHA256 d8a0eb9a7fcf9cfec900df60a9b628b7fc4f56105c40a6e4635a8244e2ce4074
- nmale/jacket11.png: 155x203 px, 5293 bytes, SHA256 b5fcaaeae5d8a630c9c4e83554f11668c59a4d181c9fe4f280cdde04456f5341
- nmale/jacket21.png: 155x203 px, 8667 bytes, SHA256 164e284850f3dad7a427e1186a46f43b12cd616409cb943647fb130c1657e5cd
- nmale/shirt1.png: 136x178 px, 5057 bytes, SHA256 ee623bff96903c930c5b55ff0946746c7747fe2c41b2f78c032532680b72f84d
- nmale/shirt11.png: 136x178 px, 3659 bytes, SHA256 5dc624e0476f32f138e344736ce643d5d688dfd5b51e2b9bd96f8e7e40f9d8f5
- nmale/shirt21.png: 136x178 px, 4361 bytes, SHA256 8234235648cfb3da9e7bac161f535f05f2677ecb1cdd7b9e6ccebe03b4d4e47d
- nmale/shirt31.png: 136x178 px, 3468 bytes, SHA256 5c37ae3d8ebcc63c673eb949aa7f3f23f77c92d45a1b97afe480bf59fb9a9fc5
- nmale/shirt41.png: 136x178 px, 3092 bytes, SHA256 8d7b8a461c1abf2ff7d4718f88d62b30226f85a0c25bf38721fb02bff0bfcc71
- nmale/shirt51.png: 136x178 px, 4141 bytes, SHA256 b97145e9b93e514cde91946ea75aa10be5e7bbc1ef59ccd092a081f9230a411d
- nmale/pants1.png: 85x175 px, 4616 bytes, SHA256 5f0c9bd0905d860281110ef0c7d617855543b7c75fa4e8eaf71e96e84859b701
- nmale/pants11.png: 85x175 px, 4614 bytes, SHA256 f7adf1a693ce4fa69e84c57cb468436db0c310fac97f9f92b760a16f2c14f738
- nmale/pants21.png: 85x175 px, 4402 bytes, SHA256 5898dec03c8828a885cb8cebab1e2c544c023b3c1ba70362d367651e622c5128
- nmale/skirt1.png: 102x178 px, 2103 bytes, SHA256 544a33e8161b728d0e4dab8be0d2d0fafddbcbbd67df264f5ad2c1e2385e762f
- nmale/skirt11.png: 102x178 px, 2583 bytes, SHA256 131d3ac87448053e3dea217f384f984aad3c1186fec67804f020e9f4d7b72eaa
- nmale/skirt21.png: 102x178 px, 3709 bytes, SHA256 31cec0d653e0e2d2cfaf18da4460c7bb6b2ed073aa3a92acc434ab4d952ab8b5
- nmale/shoes1.png: 109x66 px, 1433 bytes, SHA256 4b326fd4c27735314e3f1b8c5f5d354a0491a3af608edd4b47f5b5a90637d2f3
- nmale/shoes11.png: 109x66 px, 1543 bytes, SHA256 7b5ac38fe92ca902b651019aaf538542d21d57cec99e3134c1e99984880b8fba
- nmale/shoes21.png: 109x66 px, 1832 bytes, SHA256 408532a42e295a96dbfc140aa6111b18c49e0b34ead227b3e93dc808db2a6499
- nmale/scarf1.png: 95x106 px, 1406 bytes, SHA256 097b46413de98b6ca20761d0b95f5911c8d111ee95df42683478f562a9fdff31
- nmale/scarf11.png: 95x106 px, 1946 bytes, SHA256 54a8c26ba607f2b8e0bc26d9dd41da3568dca73c3a5855999212e3cd74723bbe
- nmale/scarf21.png: 95x106 px, 2049 bytes, SHA256 c5a84a9858d352cd10af60075729b725598aaa0e65d6d691a79082b3de1ad5f5
- nmale/belt1.png: 86x37 px, 1020 bytes, SHA256 7c1e80132875f4ea5ae4b83c6badbabc8a6a4637a63926cf8efe636dd646eeeb
- nmale/belt11.png: 86x37 px, 1166 bytes, SHA256 81631f96b6caa43b6bd2fa4db1b71a80c6741d41248be2b8d5a877e0ba7da8ad
- nmale/belt21.png: 86x37 px, 1216 bytes, SHA256 2cc3dda562a3dee1d8f9175f32cac46eeffd92c9c5c20d0d1b6e831c931a9740
- nmale/gloves1.png: 142x48 px, 1453 bytes, SHA256 42de95d03406941d9374e26f479c93c69a34c5908271ec556f70d6c9d960104d
- nmale/gloves11.png: 142x48 px, 1569 bytes, SHA256 6035bbcc171f6a15012418fe6949bd8f97f33999ca24245d61a0c20d0bcc0bed
- nmale/gloves21.png: 142x48 px, 1683 bytes, SHA256 9e985925eebe295728a4db724d6188857e747e2fa440bc3b6ebc962c7aab2701
- nmale/bjacket1.png: 102x227 px, 2776 bytes, SHA256 cfcf9cc38ee4817659ffbf51bdd3a86ad606430b78c97193f274e0df58012b39
- nmale/bjacket11.png: 102x227 px, 2295 bytes, SHA256 0da52f3c8da148133508a546110691900893c54be89f4a91172f7dd3e7ac2b9e
- nmale/bjacket21.png: 102x227 px, 2679 bytes, SHA256 7ce0b42a7d25bcd4502d1ab025a975906be13bba2a66a13210c4c45e0049b473
- nmale/bshirt1.png: 126x234 px, 1351 bytes, SHA256 4693309d60d66d4d873a8fde11da53ebe3f817e3a4a38ba17ace696972167681
- nmale/bshirt11.png: 126x234 px, 1221 bytes, SHA256 9e317e97780251d753a6f8d7b219cbc29c0229a57c8418523ee160f236e2e874
- nmale/bshirt21.png: 126x234 px, 2610 bytes, SHA256 60d700ff7675d72a44acf87548f169d0493f59bc0f63769d9bb50e11bc93280c
- nmale/bshirt31.png: 126x234 px, 2156 bytes, SHA256 bc6ab34da295cc5f3040fba012600b39c2d6e716a9a4d0301d0c7657b5e36403
- nmale/bshirt41.png: 126x234 px, 1173 bytes, SHA256 d8d04aff98e2a7c88168d331fe2e1f83411b230702236a934405ff28c38a445c
- nmale/bshirt51.png: 126x234 px, 1913 bytes, SHA256 1a8bda39703187ff0d782a3184a6004c5cda98f4944159a3cc9cd3302d00c4d7
- nmale/bskirt1.png: 92x172 px, 1776 bytes, SHA256 cce64dd96f5a682705d45d293824eada18b4571c837271b68d061dc36c3018a9
- nmale/bskirt11.png: 92x172 px, 1916 bytes, SHA256 9406425585b5ad4bc27e71805185f2aab5b225de7bcdfa68ef41e82ca870f662
- nmale/bskirt21.png: 92x172 px, 2085 bytes, SHA256 5ff39f5a81eea74553be91773d089b489a8b3c47fcbf8de3f8fcf3dd64e8ea73
- nmale/bshoes1.png: 89x39 px, 266 bytes, SHA256 ea173eea592dee94f5e74bf73b1780c1190196bd4605ae6863a714426aa035ff
- nmale/bshoes11.png: 89x39 px, 287 bytes, SHA256 7297bdb2caf7f3e249db7453b1c376113b376db26351dd4e14d8e86759007cdb
- nmale/bshoes21.png: 89x39 px, 298 bytes, SHA256 8d94231f96ced920b9be4bdeed961d026db31b50d643842702509e6a078a2c74
- nfemale/jacket1.png: 155x203 px, 6420 bytes, SHA256 56427f56fee635135d7590a92e8653d708db43344a00bad41319be677ff6d764
- nfemale/jacket11.png: 155x203 px, 5646 bytes, SHA256 10a3ee96ff8f50978b046e4f6b3edab9830a761bc0fadf246d11cc136ff2fb40
- nfemale/jacket21.png: 155x203 px, 8653 bytes, SHA256 c8173f6e3e3f07aa34077c71a8446b4d536d352e069832ba85a09677b327c458
- nfemale/shirt1.png: 136x178 px, 5185 bytes, SHA256 fdff1b02075c227637d3429d6cc1239ab746ea7a74ee9d40fbd6b411c15deea7
- nfemale/shirt11.png: 136x178 px, 4108 bytes, SHA256 9ff2858efa6dc35965a8e1ba7a3afad72c31162dc33f06de0f92ab235f965caa
- nfemale/shirt21.png: 136x178 px, 4297 bytes, SHA256 c7bdb3791bd8f7628996b4cca72d3bed31d4533eccf9443d26c74dc47c737049
- nfemale/shirt31.png: 136x178 px, 3665 bytes, SHA256 2d192bbc8ea1c0aed29b1aca883ce6ff21a64a3b8de4b5f7e1e2726c7c29ea64
- nfemale/shirt41.png: 136x178 px, 3597 bytes, SHA256 9c396f16ea38ed0a50b8ec812e4a472bf22715f6e6ba0d7170e4a097f1c58224
- nfemale/shirt51.png: 136x178 px, 4329 bytes, SHA256 044474f22f86056e7b3b01729e8bf7f81712f73a167a198bcdae79a793ac844a
- nfemale/pants1.png: 85x175 px, 4519 bytes, SHA256 88ec3652162916488471241885b368f85af2cf2b9afc139959b3e752855d0f9c
- nfemale/pants11.png: 85x175 px, 4750 bytes, SHA256 3daa67a7b4fc24c7b9546bc7c1afa052f012a1f6640609f88c71e3fbebaf6e25
- nfemale/pants21.png: 85x175 px, 4503 bytes, SHA256 6d4ea79fea9e1aae6b305c1f3b4404b31f62008bc3dbf098fba7fb5e0e98a695
- nfemale/skirt1.png: 102x178 px, 2118 bytes, SHA256 623ea04d32a3b8dee053db023ee982cf89a5c0ac4ae7a9aa897261aba2710592
- nfemale/skirt11.png: 102x178 px, 2650 bytes, SHA256 2d725bc87602fd3edd985a4d4833ba2459634ee53d349f0d32dd391c5941b6aa
- nfemale/skirt21.png: 102x178 px, 3886 bytes, SHA256 46bc041890f183897fdd40fa9a5b6325df105b8821e0339db8b012176c9df15f
- nfemale/shoes1.png: 109x66 px, 1247 bytes, SHA256 c643b9720d7c5798938685c7b3a8d9806a9d363d7046d2bddaea62c3e680035d
- nfemale/shoes11.png: 109x66 px, 1448 bytes, SHA256 e36abb59a730305abf28ea453442430ae24752aba5911c5d7b799b9da1b8f6bd
- nfemale/shoes21.png: 109x66 px, 1771 bytes, SHA256 600ad141b3585ff7855207c1b379af1f55f08b0800da55f241c881cd4afd1bd1
- nfemale/scarf1.png: 95x106 px, 1482 bytes, SHA256 689f5a868d6a66442060fccbf38a3beeb4726567b7d50f252109b62f7741abba
- nfemale/scarf11.png: 95x106 px, 1903 bytes, SHA256 49f39d142b29cdfae05c87ddb666242a932b98e41893b1dea3f151e0ecca95ac
- nfemale/scarf21.png: 95x106 px, 2021 bytes, SHA256 44b96ce1513cdb3db97701e37e62ec7d0bbc3a9c273999423ffd3b6e1a7460e2
- nfemale/belt1.png: 86x37 px, 1048 bytes, SHA256 62b0c9fb3a7768e8dc42d2bd1e1311abc0fd9a7b1fa3ebebff38a277734fb920
- nfemale/belt11.png: 86x37 px, 1162 bytes, SHA256 b2921d27982be38ee7ca20e440fa4c7f0d0d405aed6fbf37f7c53e32c8025d75
- nfemale/belt21.png: 86x37 px, 1168 bytes, SHA256 c7530e681b32566235b3012fd914e17636f313fdeaeb244747fdb856f6a122a4
- nfemale/gloves1.png: 142x48 px, 1361 bytes, SHA256 8c66efb45cfe1d8d0de4322c379a850c1ffdc16f19450605466d469313937d36
- nfemale/gloves11.png: 142x48 px, 1485 bytes, SHA256 bb30ed22cedc3c8cdfeb99406e78d662c638956028d797fe8a3d4b2dfa53ab61
- nfemale/gloves21.png: 142x48 px, 1590 bytes, SHA256 af0885e8b16619014926efe966cc62f14ddc6a8b9316254b826fcf0e90e16bf1
- nfemale/bjacket1.png: 102x227 px, 2934 bytes, SHA256 22df88e608135ebab660895fb8e887aac6d6ad55642230984051e2a61ced9146
- nfemale/bjacket11.png: 102x227 px, 2247 bytes, SHA256 e8f9797f0135541a2a65571dcf2671a98bfa798466797681a12ed8b08b3b1a9d
- nfemale/bjacket21.png: 102x227 px, 2712 bytes, SHA256 5f5cf4fb85fbabc60fce773297702f6e9a6a470361b1f9533bc806026e796ebf
- nfemale/bshirt1.png: 126x234 px, 1153 bytes, SHA256 978050542278d629730aba62dfddf85feb517a031a7f00be02afe93a2d5b3a70
- nfemale/bshirt11.png: 126x234 px, 1148 bytes, SHA256 7a3b2441970e3b9577204bff215faac71c80511232de3acf34cbe9bdd36ac1e0
- nfemale/bshirt21.png: 126x234 px, 3237 bytes, SHA256 cab1c22fd881a4677ea44b41851e2dd7625e3f746dc95449b3f0c70b131eeb19
- nfemale/bshirt31.png: 126x234 px, 2209 bytes, SHA256 ce950c7e55d2a4010bf45771c077328f89ac46960ecb9f12a00f61060288939c
- nfemale/bshirt41.png: 126x234 px, 1348 bytes, SHA256 92f208174dd7a957ee7dd63afb6fff4233bc1176cde6b362ff0c5a0b2ed37c27
- nfemale/bshirt51.png: 126x234 px, 1872 bytes, SHA256 c5dc131fc61b5f6f60d39a95abac84c2176884b754cc982f4f29fface666c88c
- nfemale/bskirt1.png: 92x172 px, 1939 bytes, SHA256 f96f18eff06e8120f2b3ae35ae9395f9c8bdeca79947aa557ae1a7cad21fe83b
- nfemale/bskirt11.png: 92x172 px, 2018 bytes, SHA256 9b4ed839a330d1b1d3dffa93eed07655676f61823f995887f9fb5764230ee33e
- nfemale/bskirt21.png: 92x172 px, 2052 bytes, SHA256 a0747736151db2fe6022df54f257ac80f8652a206c4bb5afb5c8beec6a107902
- nfemale/bshoes1.png: 89x39 px, 248 bytes, SHA256 63dc6bddfd5510eea172c25af19424a121946985e74db3b84db5732923a60140
- nfemale/bshoes11.png: 89x39 px, 280 bytes, SHA256 77d9e4844b25010b75e9197f29ce4f8404fd2f893b5f949b67b3db65e8f84a3d
- nfemale/bshoes21.png: 89x39 px, 300 bytes, SHA256 905b898098ba456b471ed7c953178d98341417e6c5c6373b88946ef94bd34160

## Rights status checked 2026-10-04

- The [Outfit Creator source page](https://rollforfantasy.com/tools/outfit-creator.php) describes the tool and its controls but does not state permission to copy or redistribute the clothing images.
- The Outfit Creator points to shared body images under `/images/armor/{male|female}/body.png`. The [Armor Creator source page](https://rollforfantasy.com/tools/armor-creator.php) states that its images are for non-commercial projects and directs users to contact the author about commercial use.
- Project-specific permission to include the clothing images or shared body images in this similar creator has not been verified. This file records source provenance and integrity; it does not grant reuse rights.
