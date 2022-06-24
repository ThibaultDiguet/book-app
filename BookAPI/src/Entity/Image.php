<?php

namespace App\Entity;

use App\Repository\ImageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(["getBook", "getImage"])]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["getBook", "getImage"])]
    private $name;

    #[ORM\Column(type: 'blob')]
    #[Groups(["getBook", "getImage"])]
    private $data;

    #[ORM\ManyToOne(targetEntity: Book::class, inversedBy: 'images')]
    #[ORM\JoinColumn(onDelete: "CASCADE")]
    #[Groups(["getImage"])]
    private $book;

    public function __construct($name, $data) //data = img in base64
    {
        $this->name = $name;
        $this->data = base64_decode($data);
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getData()
    {
        if (!is_string($this->data)) {
            return base64_encode(stream_get_contents($this->data));
        } else {
            return base64_encode($this->data);
        }
    }

    public function setData($data): self
    {
        $this->data = base64_decode($data);
        return $this;
    }

    public function getBook(): ?Book
    {
        return $this->book;
    }

    public function setBook(?Book $book): self
    {
        $this->book = $book;

        return $this;
    }

}
