---
layout: post
title: "Arkei Stealer Analysis"
categories: blog malware analysis
excerpt_separator: <!-- excerpt_end -->
---
<!-- excerpt_start -->
Arkei Stealer, first sighted in May 2018, can retrieve system data, browser data, crypto-wallet credentials
which is then exfiltrated back to the threat actor's listening post. 
<!-- excerpt_end -->
<br>
<br>

![meme](/images/ArkeiStealer/Meme.png)
<br>

### Sha256Sum
#### Packed
- 24132208490f97dede6dacfd68d0ce94ba687e362f19dbdc718e9b0c073e91c2

#### Unpacked
- 6827bff0508badecf28b1c6936fa967b82614767b0d6bbb34124fa736f940bb5

<br>
<br>

### Endpoints
#### IP Address
- hxxp[://]78[.]47[.]233[.]145
- hxxp[://]78[.]46[.]254[.]202
- hxxp[://]5[.]75[.]167[.]38
<br>

#### URLs
- hxxps[://]t[.]me/ibommat
- hxxps[://]steamcommunity[.]com/profiles/76561199446766594
<br>
<br>

### Executive summary
Arkei Stealer, A malware written in C++, is designed to enumerate and exfiltrate system and application information back to the threat actor's listening post. <br>

The data retrieved by the malware contains information such as browser cache, cookies, saved logins, crypto wallets and sensitive documents within the infected system. <br>
Data exfiltrated is stored in a .zip file and sent back to the threat actor. <br>
This malware sample doesn't have persistence.

<br>
<br>

### High Level Executive Summary
Upon execution, the malware will initially decrypt the encrypted segments located within its binary, these encrypted content contains words that relate to the Windows API,
APIs such as [VirtAlloc](https://learn.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualalloc) and [VirtualAllocExNuma](https://learn.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualallocexnuma).

Once the decryption process is completed, it will begin to dynamically allocate these APIs to different parts the memory allocated by the binary. 
The APIs that have been decrypted and moved, will be loaded with the two APIs [GetProcAddress](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getprocaddress) 
and [LoadLibraryA](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya). <br>

The malware performs a basic Sandbox check, done by checking the hostname along with the username of the system, and if any of these factors match either of these two words <b> "HAL9TH" </b> and <b>"JohnDoe"</b>,
the process will stop execution and terminate itself. <br>

After the execution of the sandbox/VM check, it will then begin decrypting the second portion of the encrypted content, the decrypted contents contains information such as Crypto-Wallets, 
Browser cache, Browser credentials along with any sensitive documents which the threat actor deems important.

The decryption process also outputs additional API calls, especially ones that relate to its communication procedure, such as, [HttpSendRequestA](https://learn.microsoft.com/en-us/windows/win32/api/wininet/nf-wininet-httpsendrequesta) and [InternetConnectA](https://learn.microsoft.com/en-us/windows/win32/api/wininet/nf-wininet-internetconnecta). <br>
Similar to the previous decryption process, the API is moved to a different location in memory and is called
with [GetProcAddress](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getprocaddress) and [LoadLibraryA](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya). <br>

Once the secondary decryption process has been completed, it will begin parse the various endpoints which contains the URL for the malware to contact back too. This malware sample uses 3 methods to parse the listener's address value. 
Through Telegram, SteamCommunity, or through a hardcoded IP address located within the binary itself. 
<br>

It will initially attempt to parse the URL from Telegram, if that fails it will then use the IP configured located within SteamCommunity,
 and if that fails, it will use the hard-coded IP address, and if that also fails, it will continuously repeat these 3 requests until it can parse a C2 Address and connect back to it.
<br>

Once a connection to the listening post has been achieved, the malware will try and retrieve a .zip file called, "update.zip". I'm unsure of what this update.zip file can contain due to all 3 URLs being down, but it might be the malware's configuration file.
By patching the binary, we can actually bypass the config check and continue further into the malware execution process, by default the malware will check and retrieve all files listed in the secondary decryption process.
<br>

Files deemed sensitive and/or useful to the malware are then stored into a .zip file and is exfiltrated back to the listening post.
<br>
<br>
<br>

### Flow Chart
![FlowChart](/images/ArkeiStealer/FlowChart.png)
<br>
<br>
<br>

### Technical Analysis
![PreUnpacked](/images/ArkeiStealer/Pre-Unpacking.png)
High Entropy, is a sign that the malware has been packed.
<br>
<br>

![Unpacked](/images/ArkeiStealer/PostUnpacking.png)
Unpacked Malware, A lower entropy with some more interesting strings.
<br>
<br>

![Strings](/images/ArkeiStealer/NotableStringsUnpacked.png)
Notable strings from the unpacked malware.
<br>
<br>

![Environment](/images/ArkeiStealer/GetEnvironmentalVariables.png)
![Debugger](/images/ArkeiStealer/DBGEnvironment.png)
Parses the environmental variables within the infected system.
<br>
<br>

### Initial Decryption Process
![DecryptInitial](/images/ArkeiStealer/DecryptEncryptedContentInitial.png)
Decrypt the encrypted content.
<br>
<br>

### Decryption Process
#### Base64
![base64](/images/ArkeiStealer/base64Decipher.png)
![API](/images/ArkeiStealer/B64DecryptionAPI.png)
The encrypted strings is initially deciphered with base64 through the use of the [CrypStringToBinaryA](https://learn.microsoft.com/en-us/windows/win32/api/wincrypt/nf-wincrypt-cryptstringtobinarya).
<br>
<br>
<br>

#### AES? Bcrypt? Decryption 
![Decryption1](/images/ArkeiStealer/DecryptionStub1.png)
![Decryption2](/images/ArkeiStealer/DecryptionStub2.png)
![Decryption3](/images/ArkeiStealer/DecryptionStub3.png)
![Decryption4](/images/ArkeiStealer/DecryptionStub4.png)
The decryption stub of the malware, unsure what algorithm it is.
<br>
<br>
<br>

### Algorithm Key?
![Key](/images/ArkeiStealer/DecryptionStubNumReference.png)
This could be the key for the decryption procedure, tested against multiple algorithms but yielded no results, found this string multiple times throughout the decryption process.
<br>
<br>
<br>

#### Api Calling 
![API Loading](/images/ArkeiStealer/LoadInitialDecryptedStubIntoLibrary.png)
The decrypted APIs are than moved into another location within the allocated memory and is loaded with the help of "GetProcAddress" and "LoadLibraryA".
<br>
<br>

### Anti-Sandbox Check
![GenericHostnameCheck](/images/ArkeiStealer/ComputerCheck.png)
The malware will perform a hostname check against the name "HAL9TH", if it does, it will proceed to the Username Check.
<br>
<br>

![GenericUsernameCheck](/images/ArkeiStealer/AntiVmCheck.png)
The malware will check the username of the host, and if it matches "JohnDoe" it will proceed to the "ExitProcess" API, effectively terminating the process.
<br>
<br>
<br>

### Secondary Decryption Process
![DecryptionAsm](/images/ArkeiStealer/SecondaryDecryptionContentNASM.png)
These two subroutines is used to decrypt and load the decrypted content into the binary's library.
<br>
<br>

### Decryption Segment
![SecondaryDecrypt1](/images/ArkeiStealer/SecondaryDecrypt1.png)
![SecondaryDecrypt2](/images/ArkeiStealer/SecondaryDecrypt2.png)
![SecondaryDecrypt3](/images/ArkeiStealer/SecondaryDecrypt3.png)
![SecondaryDecrypt4](/images/ArkeiStealer/SecondaryDecrypt5.png)
Decrypt the secondary encrypted content, contains additional APIs along with browser and crypto-wallet content.
<br>
<br>

### Load Secondary APIs into library
![LoadSecondaryLibrary](/images/ArkeiStealer/LoadSecondaryDecryptContent.png)
This procedure functions the same as the initial library loading function.
<br>
<br>
<br>

### Parsing Listener URL
##### The malware uses 3 different methods to retrieve the listening post's URL, Telegram, Steam, HardCoded IP in that order
![Mavi](/images/ArkeiStealer/ParseContentAfterMavi.png)
The first two methods of URL parsing relies on the malware parsing anything after the word "Mavi".
<br>
<br>

### Telegram
![Telegram](/images/ArkeiStealer/TelegramCall.png)
![WiresharkTele](/images/ArkeiStealer/WSTelegram.png)
The malware will attempt to contact this telegram profile for the IP in question.
<br>

![TelegramProfile](/images/ArkeiStealer/TeleGramPOC.png)
Telegram account in question.
<br>
<br>

### Steam Community
![Steam](/images/ArkeiStealer/SteamGraph.png)
![SteamCall](/images/ArkeiStealer/ParseSteam.png)
![SteamPOC](/images/ArkeiStealer/SteamPOC.png)
Parses the SteamCommunity profile for the IP address after the words "Mavi".
<br>
<br>

![SteamProfileInQuestion](/images/ArkeiStealer/SteamCommunityAbuse.png)
The steam profile in question.
<br>
<br>

### HardCoded IP
![ParseURl](/images/ArkeiStealer/ParseURL.png)
![ParseDBG](/images/ArkeiStealer/ParseHardCodedIP.png)
![HTTPREQ](/images/ArkeiStealer/HttpReq.png)
If all else fails, it will try and parse the IP that is hardcoded within the malware binary, and if this fails, the entire URL parsing process will restart.
<br>
<br>

### Stealing Stage
![Config](/images/ArkeiStealer/getUpdateZip.png)
Once the malware can connect to the listening post, it will attempt to retrieve a file called "update.zip" from the listening post.
I'm unable to grab the update.zip file as the malware was 3-4 days old and the domain went down on all 3 endpoints.
<br>
<br>

![InitStealing](/images/ArkeiStealer/InitStealing.png)
By the looks of it, the malware will proceed with the full retrieval process regardless of the content located within the update.zip file.
<br>
<br>

### Data Exfiltration
#### From further research, it looks like the malware stuffs all the stolen content into a .zip file and sends that zip file back to the listening post.
#### Suspect to rely on the update.zip file as the malware can't actually proceed after the stealing stage since I had to patch the binary to bypass the URL stage
#### [Reference](https://malpedia.caad.fkie.fraunhofer.de/details/win.arkei_stealer)
<br>
<br>
<br>





