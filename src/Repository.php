<?php

namespace Emsifa\ApiWilayah;

use InvalidArgumentException;

class Repository
{

    /**
     * @var string
     */
    protected $dataDir;

    /**
     * @var array
     */
    protected $caches = [];

    public function __construct(string $dataDir)
    {
        $this->setDataDir($dataDir);
    }

    public function getDataDir(): string
    {
        return $this->dataDir;
    }

    public function setDataDir(string $dataDir)
    {
        $this->dataDir = Helper::resolvePath($dataDir);
    }

    public function getProvinces(): array
    {
        return $this->mapCsv('provinces.csv', ['id', 'name']);
    }

    public function cache(string $file)
    {
        $rows = [];
        foreach ($this->readCsv($file) as $row) {
            $rows[] = $row;
        }
        $this->caches[$file] = $rows;
    }

    public function getRegenciesByProvinceId(string $provinceId): array
    {
        return $this->mapCsv('regencies.csv', ['id', 'province_id', 'name'], function ($row) use ($provinceId) {
            return $row[1] == $provinceId;
        });
    }

    public function getDistrictsByRegencyId(string $regencyId): array
    {
        return $this->mapCsv('districts.csv', ['id', 'regency_id', 'name'], function ($row) use ($regencyId) {
            return $row[1] == $regencyId;
        });
    }

    public function getVillagesByDistrictId(string $districtId): array
    {
        return $this->mapCsv('villages.csv', ['id', 'district_id', 'name'], function ($row) use ($districtId) {
            return $row[1] == $districtId;
        });
    }

    protected function mapCsv(string $file, array $map, callable $filter = null): array
    {
        $reader = $this->readCsv($file, $filter);
        $rows = [];
        foreach ($reader as $row) {
            $data = [];
            foreach ($map as $i => $key) {
                $data[$key] = isset($row[$i]) ? $row[$i] : null;
            }
            $rows[] = $data;
        }
        return $rows;
    }

    protected function readCsv(string $file, $filter = null)
    {
        if ($filter && !is_callable($filter)) {
            throw new InvalidArgumentException("Filter must be callable.");
        }

        $filePath = $this->getFilePath($file);

        if (!is_file($filePath)) {
            throw new InvalidArgumentException("File '{$file}' doesn't exists in data directory.");
        }

        if (isset($this->caches[$file])) {
            foreach ($this->caches[$file] as $row) {
                if ($filter && !$filter($row)) {
                    continue;
                }

                yield $row;
            }
        } else {
            $handle = fopen($filePath, 'r');
            while ($row = fgetcsv($handle)) {
                if ($filter && !$filter($row)) {
                    continue;
                }

                yield $row;
            }
            fclose($handle);
        }
    }

    protected function getFilePath(string $file)
    {
        $ds = DIRECTORY_SEPARATOR;
        return rtrim($this->dataDir, $ds).$ds.trim($file, $ds);
    }

}
