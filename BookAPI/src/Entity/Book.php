<?php

namespace App\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\BookRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BookRepository::class)]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(["getBook", "getImage"])]
    private $id;

    #[ORM\Column(type: 'string', length: 13)]
    #[Groups(["getBook", "getImage"])]
    private $isbn;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["getBook", "getImage"])]
    private $title;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["getBook", "getImage"])]
    private $description;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["getBook", "getImage"])]
    private $author;

    #[ORM\Column(type: 'date')]
    #[Groups(["getBook", "getImage"])]
    private $publication;

    #[ORM\OneToMany(mappedBy: 'book', targetEntity: Image::class, cascade: ['remove', 'persist'])]
    #[Groups(["getBook"])]
    private $images; 

    public function __construct()
    {
        $this->images = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIsbn(): ?string
    {
        return $this->isbn;
    }

    public function setIsbn(string $isbn): self
    {
        $this->isbn = $isbn;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(string $author): self
    {
        $this->author = $author;

        return $this;
    }

    public function getPublication(): ?DateTime
    {
        return $this->publication;
    }

    public function setPublication(DateTime $publication): self
    {
        $this->publication = $publication;

        return $this;
    }

    /**
     * @return Collection<int, Image>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Image $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images[] = $image;
            $image->setBook($this);
        }
        return $this;
    }

    public function removeImage(Image $image): self
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getBook() === $this) {
                $image->setBook(null);
            }
        }

        return $this;
    }
}
