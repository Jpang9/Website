---
layout: post
title: "Arkei Stealer Analysis"
categories: blog malware analysis
excerpt_separator: <!-- excerpt_end -->
---
<!-- excerpt_start -->
Arkei Stealer, first sighted in May 2018, has the ability to retrieve system data, browser data, cryptowallet credentials
and can also be used to exfiltrate files on the victims machine based on parameters set by the malicious user.
<!-- excerpt_end -->
<br>
<br>

![meme]()
<br>

### Sha256Sum
#### Packed
- 24132208490f97dede6dacfd68d0ce94ba687e362f19dbdc718e9b0c073e91c2
#### Unpacked
- 6827bff0508badecf28b1c6936fa967b82614767b0d6bbb34124fa736f940bb5
<br>
<br>

### Executive summary
Arkei Stealer, A malware written in C++. Designed to enumerate and exfiltrate system and application information back to the threat actor's listening post.
The data that is retrieved by the malware, contains information such as browser cache, cookies, saved logins, crypto wallets and sensitive documents within the infected system.
Data exfiltrated is stored in a .zip file and sent back to the threat actor. <br>
This malware sample doesn't have persistence.

<br>
<br>

### High Level Executive Summary
Upon execution, the malware will initially decrypt the encrypted segments located within its binary, these encrypted content contains words which relate to the Windows API,
APIs such as [VirtAlloc](https://learn.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualalloc) and [VirtualAllocExNuma](https://learn.microsoft.com/en-us/windows/win32/api/memoryapi/nf-memoryapi-virtualallocexnuma).

Once the decryption process has been completed, it will begin to dynamically allocate these APIs to different parts within memory. 
These APIs that has been decrypted and moved will be loaded with the two APIS, "GetProcAddress" and "LoadLibraryA". <br>

The malware performs a basic Sandbox check, by checking the hostname along with the username, and if any of these factors match either of these two words "HAL9TH" and "JohnDoe",
the process will stop execution and terminate itself. <br>

After the sandbox check has been executed, it will decrypt the second portion of the encrypted content, the content that is decrypted contains information such as Crypto-Wallets, 
Browser cache, Browser credentials along with any sensitive documents which the threat actor deems important.

The decryption process also outputs additional API calls, especially ones that relate to its communication procedure, such as, "HttpSendRequestA" and "InternetConnectA". Similar to the previous decryption process, the API are moved to a different location in memory and is called
with "GetProcAddress" and "LoadLibraryA" <br>

Once the secondary decryption process has been completed, it will begin to load the endpoints of where the malware wants to contact back to. This malware sample uses 3 methods of C2 url parsing, 
through Telegram, SteamCommunity, or through a hardcoded IP address. 
<br>

It will initially attempt to parse the URL from Telegram, if that fails, than it will use the IP configured located within SteamCommunity,
 and if that fails, it will use the hard-coded IP address, and if that fails, it will continuously repeat these 3 request until it can parse a C2 Address and connect back to it.
<br>

Once connection to a listening has been achieved, the malware will try and retrieve a .zip file called, "update.zip". I'm unsure of what this update.zip file can contain due to all 3 urls being down, but it might be the malware's configuration file.
By patching the binary, we can actually bypass the config check and continue further into the malware execution process, by default the malware will check and retrieve all files listed in the secondary decryption process.
<br>

Files deemed sensitive and/or useful to the malware are than stored into a .zip file and is exfiltrated back to the listening post.
<br>
<br>
<br>

### Flow Chart
![FlowChart]()
<br>
<br>
<br>

### Technical Analysis

<br>
<br>