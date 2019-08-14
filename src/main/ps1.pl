#!/usr/bin/perl -w

#implementation notes: this is optimized for a Windows 10 with git-bash (on which I can't install things)
#this locked down computer might have custom stuff (eg custom git-bash) causing overhead
#bash seems to be faster when I'm on ethernet instead of WiFi (for some reason)
#time git --version has "real" between 0m0.188s to 0m0.231s (mostly around 210 ms). it's faster outside a git repo for some reason
#time git status has "real" between 0m0.252s to 0m0.274s (mostly around 260 ms)
#therefore there is a lot of git overhead. every call to git adds at least 200ms. determining status only takes 50ms
#therefore the name of the optimization game is to call git as few times as possible

#this ps1 in a git repo has "real" between 0m1.976s to 0m2.509s (mostly around 2.015 s)
#this ps1 outside a git repo has "real" between 0m1.574s to 0m1.683s (mostly around 1.600 s)

use strict;        # will make you declare variables with the my keyword
use warnings;      # show warning messages
#use diagnostics;   # augments diagnostics with more explicit descriptions
#diagnostics doesn't exist in my perl
use English;
require 5.010;

my $delimiter='=';  #$_[0];
my $rootUserId = 0;

my $red=`tput setaf 1`;
#red means very important: address immediately
my $yellow=`tput setaf 3`;
#yellow means take action (but not as important as red)
my $green=`tput setaf 2`;
#green means important to the actions you are currently taking
my $cyan=`tput setaf 6`;
#cyan means noteworthy but not as important as green
my $clear=`tput setaf 9`;
#white means extra information that you can generally ignore

print main();
exit;

sub main{
   my $prompt="\n";
   $prompt.=appendPath();

   if ($EFFECTIVE_USER_ID == $rootUserId)
   {
      #This stands out from $ as much as possible
      $prompt.=$red."With great power comes great responsibility:".$clear;
   }
   else
   {
      $prompt.=appendGit();
      $prompt.='$';
   }
   return $prompt." ";
}
sub appendGit{
   my $gitStatus=`git status -unormal 2>&1`;
   chomp($gitStatus);
   if ($gitStatus =~ 'Not a git repo')
   {
      return "";
   }

   my $gitInfo="";

   $gitInfo.="branch$delimiter";
   my $branch="";
   if ($gitStatus =~ /On branch (\S+)/)
   {
      $branch=$1;
      $gitInfo.="$green$branch$clear";
   }
   elsif ($gitStatus =~ /HEAD detached at (\S+)/)
   {
      $branch=$1;
      $gitInfo.="$yellow$branch$clear";
   }
   elsif ($gitStatus =~ /rebase in progress; onto (\w+)/)
   {
      my $currentHash=$1;
      $gitInfo.="$cyan$currentHash$clear";
   }
   else
   {
      my $currentHash=`git rev-parse HEAD 2>/dev/null`;
      chomp($currentHash);
      $currentHash=substr($currentHash, 0, 7);
      $gitInfo.="$red$currentHash$clear";
      #this is red because it should be unreachable (even though the currentHash is correct)
   }

   $gitInfo.=" status$delimiter";
   if ($gitStatus =~ 'rebase in progress' and $gitStatus =~ 'all conflicts fixed')
   {
      $gitInfo.=$green."rebase --continue".$clear;
   }
   elsif ($gitStatus =~ 'rebase in progress')
   {
      $gitInfo.=$red."rebasing".$clear;
   }
   elsif ($gitStatus =~ 'You have unmerged paths')
   {
      $gitInfo.=$red."merging".$clear;
   }
   elsif ($gitStatus =~ 'All conflicts fixed but you are still merging')
   {
      $gitInfo.=$green."merge ready: commit --no-edit".$clear;
   }
   elsif ($gitStatus =~ 'Changes to be committed')
   {
      $gitInfo.=$green."staged".$clear;
   }
   elsif ($gitStatus =~ 'Changes not staged for commit')
   {
      $gitInfo.=$cyan."modified".$clear;
   }
   elsif ($gitStatus =~ 'Untracked files')
   {
      $gitInfo.=$yellow."untracked".$clear;
   }
   else
   {
      $gitInfo.="clean";
   }

   $gitInfo.=" upstream$delimiter";
   if ($gitStatus =~ 'the upstream is gone')
   {
      $gitInfo.=$cyan."gone".$clear;
   }
   elsif ($gitStatus =~ 'have diverged')
   {
      $gitInfo.=$red."out of sync".$clear;
   }
   elsif ($gitStatus =~ /Your branch is ahead of '[^']+' by (\d+)/)
   {
      $gitInfo.=$green."you're ahead $1$clear";
   }
   elsif ($gitStatus =~ /Your branch is behind '[^']+' by (\d+)/)
   {
      $gitInfo.=$yellow."you're behind $1$clear";
   }
   elsif ($gitStatus =~ 'is up to date with')
   {
      $gitInfo.="matches";
   }
   else
   {
      $gitInfo.=$cyan."none$clear";
   }

   my $logStatus=`git log --pretty=format:'%d %cr %s' -1`;
   chomp($logStatus);
   $logStatus =~ /^\s*\(([^)]+)\)/;
   #$heads always has at least HEAD
   my $heads=$1;
   $logStatus =~ s/^[^)]+\)\s*//;
   $logStatus =~ /^(.+?) ago/;
   my $commitDate=$1;
   $logStatus =~ s/^.+? ago //;
   my $commitMessage=$logStatus;

   #HEAD pointer is always first so no need to trim leading ,
   #trailing , is optional in case of no other heads
   $heads =~ s/HEAD(?: -> [^,]+)?,?\s*//;
   if ($heads ne "" and $branch =~ /^origin\//)
   {
      #heads should exclude your current HEAD (which is listed in $branch)
      $heads =~ s/$branch//;
      $heads =~ s/^, //;
      $heads =~ s/, $//;
   }
   if ($heads ne "")
   {
      $gitInfo.=" heads$delimiter$cyan$heads$clear";
   }

   $gitInfo.=" ago$delimiter$commitDate";

   if (length($commitMessage) > 73)
   {
      $commitMessage=substr($commitMessage,0,70)."...";
   }
   $gitInfo.="\ncommit$delimiter$commitMessage\n";

   return $gitInfo;
}
sub appendPath{
   my $path=`pwd`;
   chomp($path);
   return "$cyan$path$clear\n";
}
