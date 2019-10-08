<?php

namespace Emsifa\ApiWilayah;

class Generator
{
    /**
     * @var Repository
     */
    protected $repository;

    /**
     * @var string
     */
    protected $outputDir;

    public function __construct(Repository $repository, string $outputDir)
    {
        $this->repository = $repository;
        $this->outputDir = Helper::resolvePath($outputDir);
    }

    public function clearOutputDir()
    {
        $files = glob($this->outputDir.'/*');
        foreach ($files as $file) {
            Helper::removeFileOrDirectory($file);
        }

        return $this;
    }

    public function generate()
    {
        $provinces = $this->repository->getProvinces();
        $this->generateApi("/provinces.json", $provinces);

        foreach ($provinces as $province) {
            $regencies = $this->repository->getRegenciesByProvinceId($province['id']);
            $this->generateApi("/regencies/{$province['id']}.json", $regencies);
            $this->generateApi("/province/{$province['id']}.json", $province);

            foreach ($regencies as $regency) {
                $districts = $this->repository->getDistrictsByRegencyId($regency['id']);
                $this->generateApi("/districts/{$regency['id']}.json", $districts);
                $this->generateApi("/regency/{$regency['id']}.json", $regency);

                foreach ($districts as $district) {
                    $villages = $this->repository->getVillagesByDistrictId($district['id']);
                    $this->generateApi("/villages/{$district['id']}.json", $villages);
                    $this->generateApi("/district/{$district['id']}.json", $district);

                    foreach ($villages as $village) {
                        $this->generateApi("/village/{$village['id']}.json", $village);
                    }
                }
            }
        }
    }

    public function generateApi(string $uri, array $data)
    {
        $path = Helper::resolvePath($uri);

        $this->makeDirectoriesIfNotExists(dirname($path));

        $filePath = $this->getPath($path);
        file_put_contents($filePath, json_encode($data));

        echo "+ {$uri}" . PHP_EOL;
    }

    public function makeDirectoriesIfNotExists(string $path)
    {
        $path = ltrim($path, DIRECTORY_SEPARATOR);
        $dirs = explode(DIRECTORY_SEPARATOR, $path);

        $path = "";
        foreach ($dirs as $dir) {
            $path .= DIRECTORY_SEPARATOR . $dir;
            $dirPath = $this->getPath($path);
            if (!is_dir($dirPath)) {
                mkdir($dirPath);
            }
        }
    }

    public function getPath(string $path)
    {
        $ds = DIRECTORY_SEPARATOR;
        return rtrim($this->outputDir, $ds) . $ds . trim($path, $ds);
    }

}
