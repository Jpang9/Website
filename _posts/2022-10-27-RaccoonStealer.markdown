---
layout: post
title: "RaccoonStealer Analysis"
categories: blog malware analysis
excerpt_separator: <!-- excerpt_end -->
---
<!-- excerpt_start -->
An analysis performed on the Raccoon Stealer Malware; A stealer type malware designed to take anything valuable you own, such passwords,
crypto wallets, and any sensitive documents. 
<!-- excerpt_end -->

![SadgeRaccoon](/images/RaccoonStealerv2/SadgeRat.jpeg)
<br>
<br>
<br>
<br>

### Executive Statement 
MD5 - 80b0745106a9a4ed3c18264ba1887bff

RaccoonStealerV2 a stealer type Malware released in 2022, Written in C/C++, it will attempt to connect a malicious host, which will contain a set of 
information about what files need to be stolen; which is than all parsed and dumped into a sqlite database ready for exfiltration. 

It doesn't have a persistence mechanism.
<br>
<br>
<br>
<br>
<br>

### High Level Technical Summary
The malware will first update the required registries regarding your Internet Explorers cache and other related settings, 
and then it creates a unique UserID and DeviceID of your computer which is than sent to a listening post.

This process is used as a "Network Check", thus will not proceed if the listening post cannot be reached, but if the domain can be reached, it will upload the unique UserID and Device ID
to the listening post, which than grabs a config file which contains information on the types of files it will try and steal.

After retrieving the config file, the malware will start parsing everything in C:\users\{username}\appdata\local and in C:\users\{username}\appdata\Roaming; it will
parse everything such as cache content, passwords and cookies regardless of the config file. Once it has parsed everything, it will write the content as per file identifier into it 
own txt or json file, what it will write onto disk is now based on the config file.

These files are written into C:\users\{username}\Appdata\LocalLow\{FileName}, and once these files are written onto the disk, it will than be parsed into a sqlite database, which is than used 
in a TCP connection for exfiltration, after exfiltration, the malware will wipe the sqlite database and any other changes its made, pretty much going back its pre-detonation state.
<br>

![Graph](/images/RaccoonStealerv2/Graphing.jpeg)
<br>
<br>
<br>
<br>


### Static Analysis
![DllCalls](/images/RaccoonStealerv2/DllCalls.png)
Calls to these Dlls with some interesting text
<br>
<br>

![ApiCalls](/images/RaccoonStealerv2/APIcalls.png)
Calls to these Windows APIs along an interesting string "edinayarossiya - United Russia", could be a call sign? could be an encryption key?
<br>
<br>

![Compressed](/images/RaccoonStealerv2/RawVSVirtual.png)
The difference between the Virtual and Raw bytes doesn't seem that big of a difference, unlikely to be compressed file.
<br>
<br>

![Deciphering](/images/RaccoonStealerv2/Base64EncryptedTaskDecryption.png)
The Commands are deciphered from base64 and then de-encrypted from RC4 with the key "edinayarossiya"
<br>
<br>
<br>
<br>

### Dynamic Analysis
![SqliteInstructions](/images/RaccoonStealerv2/SqliteInstructions.png)
Instructions deciphered from the base64 text, which end up looking like commands and directories structures, along with file formats
<br>
<br>

![registryChanges](/images/RaccoonStealerv2/Registryedit.png)
Changes Registries to bypass proxies or anything to avoid/reduce detection.
<br>
<br>

![ConfigParsing](/images/RaccoonStealerv2/ConfigParsing.png)
Retrieves the config file after UserID and SystemID has been sent, looks to parse content body and dumps the value into the CX register.
<br>
<br>

![SuidPost](/images/RaccoonStealerv2/SuidandUserid.png)
![SuidWiresharkPost](/images/RaccoonStealerv2/wiresharkinitialtcp.png)
Creates and sends your device and user uniqueID to the malicious listener, ready to receive your information and to provide the config info.
<br>
<br>

![DataParse](/images/RaccoonStealerv2/QueryAppdata.png)
Starts checking contents of AppData and Local, for sensitive information, such as passwords, cached content, cookies
<br>
<br>

![DataWrite](/images/RaccoonStealerv2/DataDump.png)
Dumps all the data into C:\users\{username}\Appdata\LocalLow\{Filename}, preparing said file for exfiltration.
<br>
<br>

![ExfiltrationProcmon](/images/RaccoonStealerv2/exfiltrationonprocmon.png)
![ExfiltrationWireshark](/images/RaccoonStealerv2/Exfiltration.png)
Begins the exfiltration process of the file located within LocalLow, once the exfiltration process has been completed, the 
file will than be removed.

