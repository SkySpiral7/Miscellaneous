#!/usr/bin/perl -w

#TODO: confirm this works on my home computer

#implementation notes: this is optimized for a Windows 10 with git-bash (on which I can't install things)
#this locked down computer might have custom stuff (eg custom git-bash) causing overhead
#bash seems to be faster when I'm on ethernet instead of WiFi (for some reason)
#time git --version has "real" between 0m0.188s to 0m0.231s (mostly around 210 ms). it's faster outside a git repo for some reason
#time git status has "real" between 0m0.252s to 0m0.274s (mostly around 260 ms)
#therefore there is a lot of git overhead. every call to git adds at least 200ms. determining status only takes 50ms
#therefore the name of the optimization game is to call git as few times as possible

#this ps1 in a git repo has "real" between 0m1.202s to 0m1.889s (mostly around 2.300 s)
#this ps1 outside a git repo has "real" between 0m0.614s to 0m0.759s (mostly around 0.610 s)

use strict;        # will make you declare variables with the my keyword
use warnings;      # show warning messages
#use diagnostics;   # augments diagnostics with more explicit descriptions
#diagnostics doesn't exist in my perl
use English;      #for $EFFECTIVE_USER_ID instead of $<
use Cwd;
use Term::ANSIColor ':constants';
require 5.010;

use constant ROOT_USER_ID => 0;
use constant DELIMITER => '=';  #$_[0];

#Color explanations
#RED means very important: address immediately
#YELLOW means take action (but not as important as red)
#GREEN means important to the actions you are currently taking
#CYAN means noteworthy but not as important as green
#no color (white) means extra information that you can generally ignore
#Always RESET right after using a color

print main();
exit;

sub main{
   my $prompt="\n";
   $prompt.=appendPath();

   if ($EFFECTIVE_USER_ID == ROOT_USER_ID)
   {
      #This stands out from $ as much as possible
      $prompt.=RED."With great power comes great responsibility:".RESET;
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

   $gitInfo.="branch".DELIMITER;
   my $branch="";
   if ($gitStatus =~ /On branch (\S+)/)
   {
      $branch=$1;
      $gitInfo.=GREEN.$branch.RESET;
   }
   elsif ($gitStatus =~ /HEAD detached at (\S+)/)
   {
      $branch=$1;
      $gitInfo.=YELLOW.$branch.RESET;
   }
   elsif ($gitStatus =~ /rebase in progress; onto (\w+)/)
   {
      my $currentHash=$1;
      $gitInfo.=CYAN.$currentHash.RESET;
   }
   else
   {
      my $currentHash=`git rev-parse HEAD 2>/dev/null`;
      chomp($currentHash);
      $currentHash=substr($currentHash, 0, 7);
      $gitInfo.=RED.$currentHash.RESET;
      #this is red because it should be unreachable (even though the currentHash is correct)
   }

   $gitInfo.=" status".DELIMITER;
   if ($gitStatus =~ 'rebase in progress' and $gitStatus =~ 'all conflicts fixed')
   {
      $gitInfo.=GREEN."rebase --continue".RESET;
   }
   elsif ($gitStatus =~ 'rebase in progress')
   {
      $gitInfo.=RED."rebasing".RESET;
   }
   elsif ($gitStatus =~ 'You have unmerged paths')
   {
      $gitInfo.=RED."merging".RESET;
   }
   elsif ($gitStatus =~ 'All conflicts fixed but you are still merging')
   {
      $gitInfo.=GREEN."merge ready: commit --no-edit".RESET;
   }
   elsif ($gitStatus =~ 'Changes to be committed')
   {
      $gitInfo.=GREEN."staged".RESET;
   }
   elsif ($gitStatus =~ 'Changes not staged for commit')
   {
      $gitInfo.=CYAN."modified".RESET;
   }
   elsif ($gitStatus =~ 'Untracked files')
   {
      $gitInfo.=YELLOW."untracked".RESET;
   }
   else
   {
      $gitInfo.="clean";
   }

   $gitInfo.=" upstream".DELIMITER;
   if ($gitStatus =~ 'the upstream is gone')
   {
      $gitInfo.=CYAN."gone".RESET;
   }
   elsif ($gitStatus =~ 'have diverged')
   {
      $gitInfo.=RED."out of sync".RESET;
   }
   elsif ($gitStatus =~ /Your branch is ahead of '[^']+' by (\d+)/)
   {
      $gitInfo.=GREEN."you're ahead ".$1.RESET;
   }
   elsif ($gitStatus =~ /Your branch is behind '[^']+' by (\d+)/)
   {
      $gitInfo.=YELLOW."you're behind ".$1.RESET;
   }
   elsif ($gitStatus =~ 'is up to date with')
   {
      $gitInfo.="matches";
   }
   else
   {
      $gitInfo.=CYAN."none".RESET;
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
      $gitInfo.=" heads".DELIMITER.CYAN.$heads.RESET;
   }

   $gitInfo.=" ago".DELIMITER.$commitDate;

   if (length($commitMessage) > 73)
   {
      $commitMessage=substr($commitMessage,0,70)."...";
   }
   $gitInfo.="\ncommit".DELIMITER.$commitMessage."\n";

   return $gitInfo;
}
sub appendPath{
   my $path=getcwd();
   chomp($path);
   return CYAN.$path.RESET."\n";
}
