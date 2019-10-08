<?php

use Emsifa\ApiWilayah\Generator;
use Emsifa\ApiWilayah\Repository;

require "vendor/autoload.php";

$repository = new Repository(__DIR__.'/data');

$repository->cache('districts.csv');
$repository->cache('villages.csv');

$generator = new Generator($repository, __DIR__.'/static/api');

$generator->clearOutputDir();
$generator->generate();
